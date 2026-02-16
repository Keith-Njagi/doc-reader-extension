# Quick Reference Card

## 🚀 Load Extension (First Time)

```
Firefox → about:debugging → This Firefox → Load Temporary Add-on → Select manifest.json
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` | Toggle reader mode ON/OFF |
| `Ctrl+Shift+T` | Show/hide table of contents |
| `Ctrl+Shift+[` | Make text smaller (-2px) |
| `Ctrl+Shift+]` | Make text larger (+2px) |
| `Ctrl+Shift+D` | Switch theme (auto→light→dark→auto) |

*macOS: Use `Cmd` instead of `Ctrl`*

## 🎛️ Settings (Click Extension Icon)

| Setting | Range | Default |
|---------|-------|---------|
| Reader Mode | ON/OFF | OFF |
| Font Size | 12px - 24px | 16px |
| Content Width | 600px - 1200px | 800px |
| Theme | Auto/Light/Dark | Auto |
| Show TOC | ON/OFF | ON |

## 📁 File Structure

```
doc-reader-extension/
├── manifest.json          # Config
├── content/               # Runs on pages
│   ├── reader.js         # Main logic
│   ├── reader.css        # Styles
│   └── toc-extractor.js  # TOC generation
├── popup/                # Settings UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── background/           # Shortcuts
│   └── background.js
└── icons/                # Extension icons
```

## 🐛 Debug Commands

```javascript
// View current settings (in page console)
browser.storage.sync.get('readerMode').then(console.log)

// Check if reader mode is active
document.body.classList.contains('doc-reader-active')

// View TOC panel
document.querySelector('.doc-reader-toc-panel')

// View detected content
document.querySelector('.doc-reader-content')
```

## 🧪 Quick Test Sites

1. **MDN**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
2. **Python**: https://docs.python.org/3/tutorial/
3. **React**: https://react.dev/learn
4. **Rust**: https://doc.rust-lang.org/book/
5. **Vue**: https://vuejs.org/guide/

## 🔧 Common Tasks

### Reload Extension After Changes
```
about:debugging → Find extension → Click "Reload"
```

### View Console Logs
```
F12 (page console) - Content script logs
Ctrl+Shift+J (browser console) - Background script logs
```

### Reset to Defaults
```javascript
// In browser console
browser.storage.sync.remove('readerMode')
```

### Package for Distribution
```bash
cd doc-reader-extension
zip -r doc-reader.zip * -x "*.DS_Store" -x "*/__MACOSX"
```

## 🎨 Color Scheme

### Light Theme
- Background: `#ffffff`
- Text: `#333333`
- Accent: `#667eea`

### Dark Theme
- Background: `#1a1a1a`
- Text: `#e0e0e0`
- Accent: `#667eea`

## 📊 CSS Custom Properties

Change these in `reader.css`:

```css
--doc-reader-font-size: 16px;      /* Text size */
--doc-reader-content-width: 800px; /* Max width */
--doc-reader-line-height: 1.6;     /* Line spacing */
--doc-reader-font-family: ...;     /* Font stack */
```

## 🛠️ Customization Quick Hits

### Change Default Font Size
`reader.js` line ~14:
```javascript
fontSize: 18,  // Change from 16
```

### Change Default Theme
`reader.js` line ~16:
```javascript
theme: 'dark',  // Change from 'auto'
```

### Change Accent Color
`reader.css` line ~3:
```css
--doc-reader-accent: #YOUR_COLOR;
```

### Add More Selectors to Hide
`reader.js` line ~135:
```javascript
const selectorsToHide = [
  'header', 'footer', 'nav', 'aside',
  '.your-custom-selector',  // Add here
  // ...
];
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | User guide |
| `INSTALL.md` | Installation steps |
| `ARCHITECTURE.md` | Technical design |
| `TESTING_CHECKLIST.md` | QA checklist |
| `SUMMARY.md` | Implementation summary |
| `QUICK_REFERENCE.md` | This file |

## 🆘 Troubleshooting

### Extension Won't Load
- Check `manifest.json` is valid JSON
- Look for syntax errors in console
- Verify all files are present

### Reader Mode Not Working
- Check console for errors (F12)
- Try on a different site
- Reload extension

### Settings Not Saving
- Check Firefox sync is enabled
- Verify storage permissions
- Clear browser cache

### TOC Not Showing
- Verify page has headings (h1-h6)
- Check TOC toggle is ON
- Look for `.doc-reader-toc-panel` in DOM

### Keyboard Shortcuts Not Working
- Check for conflicts with site shortcuts
- Verify commands in `about:debugging`
- Try on a different page

## 💡 Pro Tips

1. **Test on multiple sites** before customizing
2. **Use Firefox DevTools** to inspect changes
3. **Read code comments** for implementation details
4. **Backup before modifying** (`git init` recommended)
5. **Check console** for helpful debug messages

## 📞 Getting Help

1. Read `README.md` for feature details
2. Check `ARCHITECTURE.md` for how it works
3. Use `TESTING_CHECKLIST.md` to verify setup
4. Review code comments for specific functions

## 🎯 One-Liner Commands

```bash
# Count lines of code
find . -name "*.js" -exec wc -l {} + | tail -1

# List all files
find . -type f | sort

# Check file sizes
du -sh *

# Grep for a function
grep -r "functionName" --include="*.js"

# Find TODOs
grep -r "TODO" --include="*.js"

# Validate JSON
python -m json.tool manifest.json

# Create distribution package
zip -r extension.zip . -x "*.git*" -x "*.DS_Store"
```

## ⚡ Speed Run (First Use)

```
1. Firefox → about:debugging
2. Load manifest.json
3. Visit developer.mozilla.org
4. Press Ctrl+Shift+R
5. Enjoy! 🎉
```

---

**Keep this file bookmarked for quick access!**
