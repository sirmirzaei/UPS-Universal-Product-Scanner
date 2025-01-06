// Store the last extracted results for CSV download
let lastExtractedResults = [];

document.addEventListener('DOMContentLoaded', async () => {
  const currentUrl = await getCurrentTabUrl();
  const hostname = new URL(currentUrl).hostname;
  await loadSavedTags(hostname);

  // Save Tags Button
  document.getElementById('save-tags').addEventListener('click', async () => {
    const itemTag = document.getElementById('item-tag').value.trim();
    const priceTag = document.getElementById('price-tag').value.trim();
    
    if (itemTag && priceTag) {
      await saveTagPair(hostname, itemTag, priceTag);
      await loadSavedTags(hostname);
      document.getElementById('item-tag').value = '';
      document.getElementById('price-tag').value = '';
      
      // Show success message
      document.getElementById('status').className = 'success';
      document.getElementById('status').textContent = 'Tags saved successfully';
    }
  });

  // Extract Data Button
  document.getElementById('extract-data').addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractProductInfo,
        args: [hostname]
      });
      
      console.log('Extraction results:', results);
      
      if (results && results[0] && results[0].result && results[0].result.length > 0) {
        displayResults(results[0].result);
      } else {
        lastExtractedResults = [];
        document.getElementById('product-list').innerHTML = '<p>No products found with current tags.</p>';
        document.getElementById('status').className = 'error';
        document.getElementById('status').textContent = 'No products found. Please check your tag definitions.';
      }
    } catch (error) {
      console.error('Error extracting data:', error);
      document.getElementById('status').className = 'error';
      document.getElementById('status').textContent = `Error: ${error.message}`;
    }
  });

  // Download CSV Button
  document.getElementById('download-csv').addEventListener('click', downloadCSV);

  // Remove button event listener
  document.getElementById('tags-list').addEventListener('click', async (e) => {
    if (e.target.classList.contains('remove-tag')) {
      const index = parseInt(e.target.dataset.index);
      await removeTagPair(hostname, index);
      await loadSavedTags(hostname);
      
      // Show success message
      document.getElementById('status').className = 'success';
      document.getElementById('status').textContent = 'Tag removed successfully';
    }
  });
});

async function getCurrentTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url;
}

async function saveTagPair(hostname, itemTag, priceTag) {
  const storage = await chrome.storage.local.get(hostname);
  const tags = storage[hostname] || [];
  tags.push({ itemTag, priceTag });
  await chrome.storage.local.set({ [hostname]: tags });
}

async function loadSavedTags(hostname) {
  const storage = await chrome.storage.local.get(hostname);
  const tags = storage[hostname] || [];
  const tagsList = document.getElementById('tags-list');
  
  tagsList.innerHTML = tags.map((tag, index) => `
    <div class="tag-pair">
      <div>
        <strong>Item:</strong> ${tag.itemTag}<br>
        <strong>Price:</strong> ${tag.priceTag}
      </div>
      <button class="remove-tag" data-index="${index}">Remove</button>
    </div>
  `).join('');
}

async function removeTagPair(hostname, index) {
  const storage = await chrome.storage.local.get(hostname);
  const tags = storage[hostname] || [];
  tags.splice(index, 1);
  await chrome.storage.local.set({ [hostname]: tags });
}

async function extractProductInfo(hostname) {
  try {
    const data = await chrome.storage.local.get(hostname);
    const tags = data[hostname] || [];
    const results = [];

    for (const tag of tags) {
      const itemSelector = '.' + tag.itemTag.split(' ').join('.');
      const priceSelector = '.' + tag.priceTag.split(' ').join('.');

      console.log('Using selectors:', { itemSelector, priceSelector });

      const itemElements = document.querySelectorAll(itemSelector);
      const priceElements = document.querySelectorAll(priceSelector);

      console.log('Found items:', Array.from(itemElements).map(el => el.textContent));
      console.log('Found prices:', Array.from(priceElements).map(el => el.textContent));

      const items = Array.from(itemElements).map(el => el.textContent.trim());
      const prices = Array.from(priceElements).map(el => el.textContent.trim());

      for (let i = 0; i < Math.min(items.length, prices.length); i++) {
        results.push({
          item: items[i],
          price: prices[i]
        });
      }
    }

    console.log('Final results:', results);
    return results;
  } catch (error) {
    console.error('Error in extractProductInfo:', error);
    return [];
  }
}

function displayResults(results) {
  console.log('Displaying results:', results);
  const productList = document.getElementById('product-list');
  const status = document.getElementById('status');
  
  if (results && results.length > 0) {
    // Store results for CSV download
    lastExtractedResults = results;
    
    let html = '<ul style="list-style: none; padding: 0;">';
    for (const item of results) {
      html += `
        <li style="margin-bottom: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <strong>Item:</strong> ${item.item}<br>
          <strong>Price:</strong> ${item.price}
        </li>`;
    }
    html += '</ul>';
    productList.innerHTML = html;
    status.className = 'success';
    status.textContent = `Successfully extracted ${results.length} items`;
  } else {
    lastExtractedResults = [];
    productList.innerHTML = '<p>No products found with current tags.</p>';
    status.className = 'error';
    status.textContent = 'No products found. Please check your tag definitions.';
  }
}

function downloadCSV() {
  if (lastExtractedResults.length === 0) {
    document.getElementById('status').className = 'error';
    document.getElementById('status').textContent = 'No data available to download';
    return;
  }

  // Create CSV content
  const csvContent = [
    ['Item', 'Price'], // Header row
    ...lastExtractedResults.map(item => [item.item, item.price])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `product_data_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Show success message
  document.getElementById('status').className = 'success';
  document.getElementById('status').textContent = 'CSV file downloaded successfully';
}