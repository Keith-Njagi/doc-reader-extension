# Documentation Reader - Firefox Extension

A clean, distraction-free documentation reading extension for Firefox that enhances your reading experience with adjustable fonts, themes, and automatic table of contents extraction.

## Features

- **Clean Reading Mode**: Removes distractions and focuses on the main content
- **Adjustable Font Size**: Customize text size (12px - 24px) for comfortable reading
- **Content Width Control**: Adjust reading width (600px - 1200px) to your preference
- **Theme Support**: Switch between light, dark, or auto (follows system preference)
- **Automatic Table of Contents**: Extracts headings and creates a navigable TOC panel
- **Keyboard Shortcuts**: Quick access to all features without using the mouse
- **Settings Persistence**: Your preferences sync across devices

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension directory and select `manifest.json`

### From Firefox Add-ons (Coming Soon)

The extension will be available on the Firefox Add-ons store once published.

## Usage

### Activating Reader Mode

There are three ways to activate reader mode:

1. **Extension Icon**: Click the extension icon in the toolbar and toggle "Reader Mode"
2. **Keyboard Shortcut**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. **Popup Settings**: Click the extension icon to open settings

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` | Toggle reader mode |
| `Ctrl+Shift+T` | Toggle table of contents |
| `Ctrl+Shift+[` | Decrease font size |
| `Ctrl+Shift+]` | Increase font size |
| `Ctrl+Shift+D` | Cycle through themes (auto → light → dark) |

### Settings

Open the popup by clicking the extension icon to access:

- **Reader Mode Toggle**: Turn reader mode on/off
- **Font Size**: Adjust text size with a slider
- **Content Width**: Control the maximum width of content
- **Theme**: Choose between Auto, Light, or Dark themes
- **Show TOC**: Toggle the table of contents panel

## How It Works

### Content Detection

The extension uses intelligent heuristics to detect the main content area:

1. **Priority 1**: Semantic HTML5 elements (`<article>`, `<main>`, `[role="main"]`)
2. **Priority 2**: Common content selectors (`.content`, `#article`, etc.)
3. **Priority 3**: Largest text block with significant content

### TOC Extraction

The extension scans for heading tags (h1-h6) within the detected content area and builds a hierarchical table of contents with:

- Nested structure preserving heading levels
- Smooth scroll navigation to sections
- Active section highlighting while scrolling
- Automatic anchor ID generation if missing

### Theme System

Themes are applied using CSS custom properties:

- **Light Theme**: Clean white background with dark text
- **Dark Theme**: Dark gray background with light text
- **Auto Theme**: Follows system color scheme preference

## Browser Compatibility

- **Firefox**: 109+ (Manifest V3 support)
- **Chrome/Edge**: Not currently supported (Firefox-specific API usage)

## File Structure

```
doc-reader-extension/
├── manifest.json              # Extension configuration
├── content/
│   ├── reader.js             # Main content script
│   ├── reader.css            # Reading mode styles
│   └── toc-extractor.js      # Table of contents extraction
├── popup/
│   ├── popup.html            # Settings UI
│   ├── popup.js              # Settings logic
│   └── popup.css             # Settings styles
├── background/
│   └── background.js         # Keyboard shortcuts handler
├── icons/
│   ├── icon-16.svg           # Small icon
│   ├── icon-48.svg           # Medium icon
│   └── icon-128.svg          # Large icon
└── README.md                 # This file
```

## Development

### Testing

Test the extension on various documentation sites:

- **MDN**: https://developer.mozilla.org/
- **Python Docs**: https://docs.python.org/
- **React**: https://react.dev/
- **MDN Web Docs**: https://developer.mozilla.org/
- **Rust Book**: https://doc.rust-lang.org/book/

### Debugging

1. Open Firefox DevTools (`F12`)
2. Navigate to the "Console" tab
3. Filter by "Content" to see content script logs
4. Use `about:debugging` → "Inspect" to debug the background script

### Building Icons (Optional)

The extension includes SVG icons. To convert them to PNG:

```bash
# Install ImageMagick or use an online converter
convert -background none -size 16x16 icons/icon-16.svg icons/icon-16.png
convert -background none -size 48x48 icons/icon-48.svg icons/icon-48.png
convert -background none -size 128x128 icons/icon-128.svg icons/icon-128.png
```

Note: Firefox supports SVG icons directly, so PNG conversion is optional.

## Permissions

The extension requires the following permissions:

- **activeTab**: Access the current tab's content to apply reading mode
- **storage**: Save and sync user preferences across devices
- **scripting**: Inject content scripts into web pages

## Privacy

- **No Data Collection**: The extension does not collect, transmit, or store any user data externally
- **Local Storage Only**: All settings are stored locally using Firefox's sync storage
- **No Analytics**: No tracking or analytics are implemented
- **Open Source**: All code is available for review

## Contributing

Contributions are welcome! Please feel free to:

1. Report bugs or request features via GitHub issues
2. Submit pull requests with improvements
3. Share feedback and suggestions

## Future Enhancements

Potential features for future versions:

- [ ] Custom site-specific rules for content detection
- [ ] Reading progress tracker
- [ ] Export/import settings
- [ ] Custom keyboard shortcut configuration
- [ ] Reading time estimation
- [ ] Bookmark and annotation support
- [ ] Print-optimized view

## License

MIT License - Feel free to use, modify, and distribute this extension.

## Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/doc-reader-extension/issues)
- **Email**: your.email@example.com

## Credits

Created by [Your Name]

Built with:
- Firefox WebExtensions API
- Vanilla JavaScript (no frameworks)
- Modern CSS features

---

**Enjoy distraction-free documentation reading!** 📚
