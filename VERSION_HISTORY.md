# Version History

## Version 1.0.0 (Initial Release)

**Release Date**: 2026-02-16

### Features

#### Core Functionality
- ✅ Clean reading mode with intelligent content detection
- ✅ Automatic table of contents extraction and navigation
- ✅ Adjustable font size (12px - 24px)
- ✅ Adjustable content width (600px - 1200px)
- ✅ Theme system (Light / Dark / Auto)
- ✅ Settings persistence via browser.storage.sync

#### User Interface
- ✅ Extension popup with settings controls
- ✅ Collapsible TOC panel with smooth animations
- ✅ Visual feedback for active sections
- ✅ Clean, modern design with gradient header

#### Keyboard Shortcuts
- ✅ `Ctrl+Shift+R` - Toggle reader mode
- ✅ `Ctrl+Shift+T` - Toggle TOC panel
- ✅ `Ctrl+Shift+[` - Decrease font size
- ✅ `Ctrl+Shift+]` - Increase font size
- ✅ `Ctrl+Shift+D` - Cycle themes

#### Technical
- ✅ Manifest V3 (Firefox standard)
- ✅ Content script injection on all URLs
- ✅ Message passing architecture
- ✅ Background service worker for commands
- ✅ Performance optimizations (scroll throttling, lazy loading)
- ✅ Security best practices (no inline scripts, input sanitization)

### Documentation
- ✅ Comprehensive README with usage guide
- ✅ Installation guide (INSTALL.md)
- ✅ Architecture documentation (ARCHITECTURE.md)
- ✅ Testing checklist (TESTING_CHECKLIST.md)
- ✅ Implementation summary (SUMMARY.md)
- ✅ Quick reference card (QUICK_REFERENCE.md)

### Files
- 20 total files
- ~144KB total size
- All core components implemented
- Icons in PNG and SVG formats

### Known Limitations
- Works best on static documentation sites
- May require tweaking for complex single-page applications
- Content detection accuracy varies by site structure
- Some keyboard shortcuts may conflict with site-specific shortcuts

### Browser Compatibility
- **Primary**: Firefox 109+ (Manifest V3 support)
- **Future**: Chrome/Edge (requires API adjustments)

---

## Roadmap for Future Versions

### Version 1.1.0 (Planned)
- [ ] Custom site-specific rules for better content detection
- [ ] Reading progress indicator
- [ ] Reading time estimation
- [ ] Improved SPA support (MutationObserver for dynamic content)

### Version 1.2.0 (Planned)
- [ ] Export/import settings
- [ ] Custom keyboard shortcut configuration
- [ ] Additional theme presets (Sepia, High Contrast)
- [ ] Font family selector

### Version 2.0.0 (Future)
- [ ] Annotations and highlights
- [ ] Bookmarks within documents
- [ ] Reading history
- [ ] Synchronization improvements
- [ ] Print-optimized view

---

## Contributing

Found a bug or have a feature request? Please document it with:
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Browser version and OS
- Screenshots if applicable

---

## Credits

**Initial Development**: February 2026
**License**: MIT
**Built with**: Firefox WebExtensions API, Vanilla JavaScript, Modern CSS
