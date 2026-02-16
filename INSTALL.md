# Quick Installation Guide

## Loading the Extension in Firefox

1. **Open Firefox** and navigate to `about:debugging` in the address bar

2. Click **"This Firefox"** in the left sidebar

3. Click the **"Load Temporary Add-on..."** button

4. Navigate to the extension directory:
   ```
   /Users/keithnjagi/projects/Keith/CodeSIL/Learn/go_intro/doc-reader-extension
   ```

5. Select the **`manifest.json`** file and click "Open"

6. The extension is now loaded! You should see it in your extensions list

## Quick Test

1. Visit a documentation site (e.g., https://developer.mozilla.org/)

2. Press **`Ctrl+Shift+R`** (or **`Cmd+Shift+R`** on Mac) to toggle reader mode

3. Or click the extension icon in the toolbar to access settings

## First Use

1. **Click the extension icon** in the toolbar (purple book icon)

2. **Toggle "Reader Mode"** to ON

3. The page will transform into a clean reading view with:
   - Distraction-free content
   - Table of contents panel (on the right)
   - Clean typography

4. **Customize your experience**:
   - Adjust font size with the slider
   - Change content width
   - Switch between light/dark themes
   - Toggle the TOC panel

## Keyboard Shortcuts

Once reader mode is active, use these shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` | Toggle reader mode ON/OFF |
| `Ctrl+Shift+T` | Show/hide table of contents |
| `Ctrl+Shift+,` | Decrease font size |
| `Ctrl+Shift+.` | Increase font size |
| `Ctrl+Shift+D` | Cycle themes (auto → light → dark) |

*Note: On macOS, use `Cmd` instead of `Ctrl`*

## Testing Recommendations

Try the extension on these popular documentation sites:

1. **MDN Web Docs**: https://developer.mozilla.org/
2. **Python Documentation**: https://docs.python.org/3/
3. **React Documentation**: https://react.dev/learn
4. **Rust Book**: https://doc.rust-lang.org/book/
5. **Vue.js Guide**: https://vuejs.org/guide/

## Troubleshooting

### Extension Not Working

1. **Reload the extension**:
   - Go to `about:debugging`
   - Click "Reload" next to the extension

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for any error messages

3. **Verify permissions**:
   - The extension needs access to the active tab
   - Firefox may prompt for permissions on first use

### Content Not Detected

If reader mode doesn't work on a specific page:

1. The page might not have clear content structure
2. The content might be dynamically loaded (try waiting a moment)
3. Some sites have complex layouts that are harder to detect

### Settings Not Persisting

1. Ensure Firefox sync is enabled for better persistence
2. Check that storage permissions are granted
3. Try clearing browser cache and reloading the extension

## Uninstalling

**Temporary Installation** (Development):
- Go to `about:debugging` → "This Firefox"
- Click "Remove" next to the extension
- Or restart Firefox (temporary extensions are removed on restart)

**Permanent Installation** (Once published):
- Right-click the extension icon → "Remove Extension"
- Or go to `about:addons` → Extensions → Remove

## Permanent Installation

This extension is currently in development. To make it permanent:

1. **Package the extension**:
   ```bash
   cd doc-reader-extension
   zip -r doc-reader.zip *
   ```

2. **Self-sign** (for personal use):
   - Visit https://addons.mozilla.org/developers/
   - Submit the zip file for signing
   - Download the signed .xpi file

3. **Install the signed extension**:
   - Open the .xpi file in Firefox
   - Click "Add" when prompted

## Development Notes

- **Temporary extensions** are removed when Firefox restarts
- Use `about:debugging` → "Reload" to test changes
- Check the **Browser Console** (`Ctrl+Shift+J`) for background script logs
- Check the **Page Console** (F12) for content script logs

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review the code comments for implementation details
- Open an issue if you encounter bugs

---

**Happy distraction-free reading!** 📖
