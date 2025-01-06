# Universal Product Scanner Chrome Extension

A powerful Chrome extension that allows users to extract product information from any website using custom HTML class tags. Perfect for price comparison, inventory management, and market research.

## Features

- 🎯 **Universal Compatibility**: Works with any e-commerce website
- 🏷️ **Custom Tag Definition**: Define your own HTML class tags for items and prices
- 💾 **Site-Specific Memory**: Saves different tag configurations for each website
- 📊 **CSV Export**: Export extracted data in CSV format
- 🔄 **Real-time Extraction**: Instantly extract product information
- 🎨 **Clean Interface**: User-friendly popup interface


## Installation

### From Chrome Web Store
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension directory

## How It Works

### 1. Finding HTML Class Tags
Before using the extension, you need to identify the HTML class tags for products on your target website:

1. Right-click on the product element (item code/number)
2. Select "Inspect"
3. Look for the class names in the highlighted HTML
4. Copy the relevant class names (e.g., "part-info__code js-ga-product-line-number")
5. Repeat for price elements

### 2. Setting Up Tags

1. Click the extension icon in Chrome toolbar
2. In the "Define Tags" section:
   - Enter the item class tag in the first input field
   - Enter the price class tag in the second input field
3. Click "Save Tags"
4. Your tags are now saved for this specific website

### 3. Extracting Data

1. Navigate to the product page
2. Click the extension icon
3. Click "Extract Data"
4. Review the extracted information
5. Click "Download CSV" to export the data

## Troubleshooting Guide

### No Data Found
If you see "No products found with current tags":
1. Verify the class names are correct
2. Make sure you're on the right page
3. Check if the website's structure has changed
4. Try using different class combinations

### Incorrect Data
If the extracted data doesn't match what you see:
1. Make sure you're using the most specific class names
2. Check if there are multiple elements with the same class
3. Try using a combination of classes for more precise targeting

### CSV Export Issues
If the CSV file is empty or contains incorrect data:
1. Make sure data was successfully extracted first
2. Try extracting the data again
3. Clear the extension's saved data and restart

## Technical Details

The extension uses:
- Chrome Extension Manifest V3
- Chrome Storage API for saving site-specific tags
- Chrome Scripting API for DOM manipulation
- Modern JavaScript (ES6+)
- Custom CSS for styling

## Privacy & Security

- ✅ No data is sent to external servers
- ✅ All data is stored locally in your browser
- ✅ No tracking or analytics
- ✅ Minimal permissions required

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Mehran Mirzaei - [LinkedIn](https://www.linkedin.com/in/mehranmirzaei/)

Project Link: [https://github.com/yoursirmirzaei/UPS-universal-product-scanner](https://github.com/sirmirzaei/UPS-universal-product-scanner)

## Acknowledgments

- Thanks to all contributors and users
- Special thanks to the Chrome Extensions community

---
