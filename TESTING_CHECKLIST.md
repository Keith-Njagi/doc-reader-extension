# Testing Checklist

Use this checklist to verify all features of the Documentation Reader extension are working correctly.

## Pre-Installation Checks

- [ ] All files present (17 files total)
- [ ] Icons generated (PNG files in icons/ directory)
- [ ] manifest.json is valid JSON
- [ ] No syntax errors in JavaScript files

## Installation

- [ ] Extension loads in Firefox without errors
- [ ] Extension appears in toolbar
- [ ] Extension icon displays correctly
- [ ] No console errors on load

**How to verify**:
1. Go to `about:debugging` → "This Firefox"
2. Click "Load Temporary Add-on"
3. Select `manifest.json`
4. Check for errors in the debugging panel

## Basic Functionality

### Reader Mode Toggle

- [ ] Can enable reader mode via keyboard shortcut (`Ctrl+Shift+R`)
- [ ] Can enable reader mode via popup toggle
- [ ] Can enable reader mode via extension icon click
- [ ] Page content is properly isolated
- [ ] Distracting elements are hidden
- [ ] Can disable reader mode and restore original view

**Test on**:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript
- https://docs.python.org/3/tutorial/

### Content Detection

- [ ] Detects main content on MDN
- [ ] Detects main content on Python docs
- [ ] Detects main content on React docs
- [ ] Detects main content on Vue docs
- [ ] Handles pages with `<article>` tags
- [ ] Handles pages with `<main>` tags
- [ ] Falls back to heuristic detection when needed

**Test on various documentation sites**:
- [ ] developer.mozilla.org
- [ ] docs.python.org
- [ ] react.dev
- [ ] vuejs.org
- [ ] doc.rust-lang.org

### Table of Contents

- [ ] TOC panel appears when reader mode is enabled
- [ ] TOC extracts all headings (h1-h6)
- [ ] TOC shows hierarchical structure
- [ ] Clicking TOC links scrolls to correct section
- [ ] Scrolling updates active TOC item
- [ ] TOC can be toggled on/off
- [ ] TOC persists across page reloads
- [ ] TOC close button works

**Test scenarios**:
- Page with nested headings (h1 → h2 → h3)
- Page with only top-level headings
- Page with no headings (should show "No headings found")
- Very long page with many sections

## Settings & Customization

### Font Size

- [ ] Font size slider works in popup
- [ ] Font size updates in real-time
- [ ] Font size persists across sessions
- [ ] Increase font keyboard shortcut works (`Ctrl+Shift+]`)
- [ ] Decrease font keyboard shortcut works (`Ctrl+Shift+[`)
- [ ] Min/max bounds respected (12px - 24px)

**Verification**:
1. Open popup
2. Adjust font size slider
3. Verify text size changes on page
4. Close and reopen popup
5. Verify slider position matches

### Content Width

- [ ] Content width slider works in popup
- [ ] Content width updates in real-time
- [ ] Content width persists across sessions
- [ ] Width is visually appropriate at different settings
- [ ] Min/max bounds respected (600px - 1200px)

**Verification**:
1. Set width to 600px - content should be narrow
2. Set width to 1200px - content should be wide
3. Verify centered layout

### Theme System

- [ ] Auto theme follows system preference
- [ ] Light theme applies correctly
- [ ] Dark theme applies correctly
- [ ] Theme toggle keyboard shortcut works (`Ctrl+Shift+D`)
- [ ] Theme persists across sessions
- [ ] Theme transitions are smooth

**Test scenarios**:
1. **Light theme**:
   - [ ] White background
   - [ ] Dark text
   - [ ] Good contrast
   - [ ] Code blocks styled appropriately

2. **Dark theme**:
   - [ ] Dark background (#1a1a1a)
   - [ ] Light text (#e0e0e0)
   - [ ] Good contrast
   - [ ] Code blocks styled appropriately

3. **Auto theme**:
   - [ ] Matches system light mode
   - [ ] Matches system dark mode
   - [ ] Updates when system preference changes

## Keyboard Shortcuts

Test all keyboard shortcuts:

- [ ] `Ctrl+Shift+R` - Toggle reader mode
- [ ] `Ctrl+Shift+T` - Toggle TOC
- [ ] `Ctrl+Shift+[` - Decrease font size
- [ ] `Ctrl+Shift+]` - Increase font size
- [ ] `Ctrl+Shift+D` - Toggle theme

**Platform-specific**:
- [ ] macOS: Shortcuts work with `Cmd` instead of `Ctrl`
- [ ] Windows/Linux: Shortcuts work with `Ctrl`

**Conflict testing**:
- [ ] Shortcuts don't interfere with browser shortcuts
- [ ] Shortcuts don't interfere with page shortcuts

## Popup UI

- [ ] Popup opens when clicking extension icon
- [ ] All controls are visible and accessible
- [ ] Toggle switches work correctly
- [ ] Sliders move smoothly
- [ ] Value labels update in real-time
- [ ] Theme buttons highlight active theme
- [ ] Keyboard shortcuts section is expandable
- [ ] UI is responsive and fits in popup window

**Visual checks**:
- [ ] Proper spacing and alignment
- [ ] Colors match design
- [ ] Icons/emojis display correctly
- [ ] Text is readable

## Storage & Persistence

- [ ] Settings persist after closing popup
- [ ] Settings persist after browser restart
- [ ] Settings persist after extension reload
- [ ] Settings sync across Firefox instances (if sync enabled)
- [ ] Default settings applied on first install

**Test flow**:
1. Change all settings
2. Close popup
3. Reopen popup → settings should match
4. Reload extension → settings should persist
5. Restart Firefox → settings should persist

## Edge Cases

### Content Detection Edge Cases

- [ ] Page with no clear content structure
- [ ] Page with multiple `<article>` tags
- [ ] Page with dynamically loaded content
- [ ] Single-page application (SPA)
- [ ] Page with iframes
- [ ] Very short page (< 200 characters)
- [ ] Very long page (> 10,000 words)

### TOC Edge Cases

- [ ] Page with no headings
- [ ] Page with only h1 tags (flat structure)
- [ ] Page with deeply nested headings (h1 → h6)
- [ ] Page with duplicate heading text
- [ ] Page with headings containing special characters
- [ ] Page with headings containing HTML entities
- [ ] Headings with existing IDs preserved

### UI Edge Cases

- [ ] Very long heading text in TOC
- [ ] TOC with 100+ items (performance)
- [ ] Narrow browser window (responsive behavior)
- [ ] Very wide browser window
- [ ] Browser zoom at 50%
- [ ] Browser zoom at 200%

## Performance

- [ ] Extension loads quickly (< 1 second)
- [ ] Reader mode activates quickly (< 500ms)
- [ ] No noticeable lag when scrolling
- [ ] TOC navigation is smooth
- [ ] Theme switching is instant
- [ ] No memory leaks (check after extended use)

**Tools**:
- Firefox DevTools Performance tab
- about:performance

## Accessibility

- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] Screen reader labels present (aria-label)
- [ ] Color contrast meets WCAG standards
- [ ] Text remains readable at all font sizes
- [ ] Interactive elements have sufficient size

## Cross-Site Testing

Test on these different documentation styles:

- [ ] **MDN** (developer.mozilla.org)
  - [ ] Content detected
  - [ ] TOC generated
  - [ ] Styling applied correctly

- [ ] **Python Docs** (docs.python.org)
  - [ ] Content detected
  - [ ] TOC generated
  - [ ] Styling applied correctly

- [ ] **React** (react.dev)
  - [ ] Content detected
  - [ ] TOC generated
  - [ ] Styling applied correctly

- [ ] **Rust Book** (doc.rust-lang.org/book)
  - [ ] Content detected
  - [ ] TOC generated
  - [ ] Styling applied correctly

- [ ] **Vue.js** (vuejs.org)
  - [ ] Content detected
  - [ ] TOC generated
  - [ ] Styling applied correctly

## Browser Console

- [ ] No JavaScript errors in page console
- [ ] No JavaScript errors in browser console
- [ ] No warnings about deprecated APIs
- [ ] No CSP violations
- [ ] No CORS errors

**Check in**:
- Page Console (F12)
- Browser Console (Ctrl+Shift+J)

## Cleanup & Restore

- [ ] Disabling reader mode restores original page
- [ ] Hidden elements are shown again
- [ ] Original styles are restored
- [ ] TOC panel is removed
- [ ] No leftover DOM elements
- [ ] No memory leaks

**Verification**:
1. Enable reader mode
2. Inspect DOM changes
3. Disable reader mode
4. Verify DOM restored to original state

## Security

- [ ] No inline scripts in HTML files
- [ ] No eval() in JavaScript
- [ ] All user input is sanitized
- [ ] HTML in TOC is properly escaped
- [ ] No XSS vulnerabilities
- [ ] Permissions are minimal and justified

## Documentation

- [ ] README.md is complete and accurate
- [ ] INSTALL.md is clear and helpful
- [ ] ARCHITECTURE.md explains design
- [ ] Code comments are present
- [ ] Keyboard shortcuts documented

---

## Quick Test Script

For rapid testing, follow this sequence:

1. **Load extension** → Check for errors
2. **Visit MDN** → Press `Ctrl+Shift+R`
3. **Verify reader mode** → Content clean, TOC visible
4. **Test navigation** → Click TOC links
5. **Test shortcuts** → Try all keyboard shortcuts
6. **Open popup** → Adjust all settings
7. **Reload page** → Verify settings persist
8. **Test on 3 more sites** → Verify portability
9. **Disable reader mode** → Verify restoration
10. **Check console** → No errors

---

## Known Limitations

Document any known issues:

- [ ] Some sites may not detect content correctly
- [ ] Dynamic content may require page refresh
- [ ] Very complex layouts may not work perfectly
- [ ] Some keyboard shortcuts may conflict with site shortcuts

---

## Sign-Off

Date tested: _______________

Tested by: _______________

All critical features working: ☐ Yes ☐ No

Ready for use: ☐ Yes ☐ No

Notes:
_________________________________
_________________________________
_________________________________
