# Architecture Overview

## High-Level Architecture

The Documentation Reader extension follows a standard Firefox WebExtension architecture with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
├─────────────────────────────────────────────────────────────┤
│  Popup UI (popup.html)  │  Extension Icon  │  Keyboard     │
│  - Settings controls     │  - Toggle mode   │  - Shortcuts  │
│  - Theme selector        │  - Quick access  │  - Commands   │
└──────────┬──────────────┴──────────┬────────┴───────┬───────┘
           │                         │                 │
           │ Messages                │ Messages        │ Commands
           ▼                         ▼                 ▼
┌──────────────────────┐   ┌─────────────────────────────────┐
│  Background Worker   │   │      Content Scripts           │
│  (background.js)     │   │  (reader.js, toc-extractor.js) │
│                      │   │                                  │
│  - Command handler   │   │  - Content detection            │
│  - Message routing   │   │  - DOM manipulation             │
│  - Badge updates     │   │  - TOC extraction               │
└──────────────────────┘   │  - Style injection              │
                            │  - Settings application         │
                            └─────────────────────────────────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │  Web Page    │
                                  │  - Content   │
                                  │  - Structure │
                                  └──────────────┘
```

## Component Details

### 1. Manifest (manifest.json)

**Purpose**: Extension configuration and permissions

**Key Features**:
- Manifest V3 (latest Firefox standard)
- Permissions: `activeTab`, `storage`, `scripting`
- Content scripts injection rules
- Keyboard command definitions
- Browser action (popup) configuration

**Important Notes**:
- Uses `<all_urls>` to work on any page
- Content scripts run at `document_idle` for better performance
- Commands use `Ctrl+Shift+[Key]` to avoid conflicts

### 2. Background Service Worker (background/background.js)

**Purpose**: Handle keyboard shortcuts and coordinate between components

**Responsibilities**:
- Listen for keyboard commands
- Route commands to active tab's content script
- Update extension badge (optional visual feedback)
- Initialize default settings on installation

**Message Flow**:
```
Keyboard Press → browser.commands.onCommand
                ↓
    Get Active Tab (browser.tabs.query)
                ↓
    Send Message to Content Script
                ↓
    Content Script Executes Action
```

**Why Background Script?**:
- Content scripts can't listen to keyboard commands directly
- Provides a central coordination point
- Manages extension-wide state

### 3. Content Scripts

#### a) TOC Extractor (content/toc-extractor.js)

**Purpose**: Extract and structure table of contents from page headings

**Algorithm**:
```javascript
1. Find all headings (h1-h6) in content area
2. Ensure each heading has a unique ID
3. Build flat list with level information
4. Convert to hierarchical structure
5. Generate HTML for TOC panel
```

**Data Structure**:
```javascript
{
  id: "heading-id",        // For anchor links
  text: "Heading Text",    // Display text
  level: 2,                // 1-6 (h1-h6)
  element: HTMLElement,    // Reference to heading
  children: []             // Nested headings
}
```

**Why Separate?**:
- Modular design (easier to test and maintain)
- Can be reused independently
- Clear separation of concerns

#### b) Reader Script (content/reader.js)

**Purpose**: Main logic for reader mode functionality

**Key Methods**:

1. **Content Detection** (`findMainContent()`):
   ```
   Priority 1: <article>, <main>, [role="main"]
   Priority 2: Common selectors (.content, #article, etc.)
   Priority 3: Largest text block heuristic
   ```

2. **Distraction Removal** (`hideDistractingElements()`):
   - Hides headers, footers, navigation, ads
   - Preserves original display styles
   - Restores on disable

3. **Settings Application** (`applySettings()`):
   - Updates CSS custom properties
   - Applies theme classes
   - Triggers layout recalculation

4. **TOC Management** (`createTOC()`, `toggleTOC()`):
   - Generates TOC panel
   - Implements smooth scrolling
   - Highlights active section on scroll

**State Management**:
```javascript
{
  isReaderMode: boolean,      // Current mode state
  contentElement: HTMLElement, // Detected main content
  hiddenElements: Array,       // Elements to restore
  tocPanel: HTMLElement,       // TOC panel reference
  settings: Object             // User preferences
}
```

### 4. Reader Styles (content/reader.css)

**Purpose**: Visual styling for reader mode

**CSS Architecture**:
```css
:root {
  /* CSS Custom Properties (Variables) */
  --doc-reader-font-size: 16px;
  --doc-reader-content-width: 800px;
  --doc-reader-line-height: 1.6;
}

/* Theme-based styling */
.doc-reader-theme-light { /* Light colors */ }
.doc-reader-theme-dark  { /* Dark colors */ }

/* Component styling */
.doc-reader-content    { /* Main content */ }
.doc-reader-toc-panel  { /* TOC sidebar */ }
```

**Key Features**:
- CSS variables for dynamic updates
- Theme classes for easy switching
- Responsive design with media queries
- Smooth transitions and animations

### 5. Popup UI (popup/*)

**Purpose**: Settings interface for user preferences

**Structure**:
```
popup.html
├── Header (branding)
├── Settings Controls
│   ├── Reader Mode Toggle
│   ├── Font Size Slider
│   ├── Content Width Slider
│   ├── Theme Buttons
│   ├── TOC Toggle
│   └── Keyboard Shortcuts Info
└── Footer
```

**State Synchronization**:
```
1. Popup opens → Load settings from storage
2. User changes setting → Update local state
3. Save to storage → browser.storage.sync.set()
4. Send message to content script → Apply changes
```

**Why Popup?**:
- Quick access without leaving the page
- Visual feedback for settings
- Standard extension UX pattern

## Data Flow

### 1. Enable Reader Mode

```
User Action (Keyboard/Icon/Popup)
    ↓
Background receives command
    ↓
Sends "toggleReaderMode" to content script
    ↓
Content script:
  1. Detects main content
  2. Hides distracting elements
  3. Applies reader wrapper
  4. Extracts and creates TOC
  5. Applies user settings
    ↓
Updates storage (settings.enabled = true)
    ↓
Page transforms to reader view
```

### 2. Change Settings

```
User adjusts slider in popup
    ↓
Popup updates local state
    ↓
Saves to browser.storage.sync
    ↓
Sends "updateSettings" message
    ↓
Content script receives settings
    ↓
Updates CSS custom properties
    ↓
Page updates in real-time
```

### 3. Navigate TOC

```
User clicks TOC link
    ↓
Event listener prevents default
    ↓
Gets target heading ID
    ↓
Calls scrollIntoView() with smooth behavior
    ↓
Scroll observer detects active section
    ↓
Updates active link highlighting
```

## Storage Schema

```javascript
{
  readerMode: {
    enabled: false,      // Reader mode active state
    fontSize: 16,        // In pixels (12-24)
    contentWidth: 800,   // In pixels (600-1200)
    theme: 'auto',       // 'auto' | 'light' | 'dark'
    showTOC: true        // TOC panel visibility
  }
}
```

**Storage Type**: `browser.storage.sync`
- Syncs across devices (if Firefox Sync enabled)
- 100KB quota per extension
- Automatic conflict resolution

## Security Considerations

### Content Security Policy

The extension follows these security principles:

1. **No inline scripts**: All JavaScript in external files
2. **No eval()**: No dynamic code execution
3. **Minimal permissions**: Only necessary permissions requested
4. **Input sanitization**: HTML escaped in TOC generation

### XSS Prevention

```javascript
// Safe: Using textContent
element.textContent = userInput;

// Safe: Escaping HTML
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;

// Unsafe (avoided): Direct innerHTML
element.innerHTML = userInput; // ❌ Never used
```

## Performance Optimizations

### 1. Lazy Initialization
- Content scripts only activate when needed
- TOC only generated when reader mode enabled

### 2. Efficient DOM Operations
- Batch style changes using CSS variables
- Minimize reflows and repaints
- Use `requestAnimationFrame` for scroll events

### 3. Scroll Throttling
```javascript
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateActiveSection();
      ticking = false;
    });
    ticking = true;
  }
});
```

### 4. Memory Management
- Store only references, not cloned nodes
- Clean up event listeners on disable
- Remove TOC panel when not needed

## Browser Compatibility

### Firefox-Specific Features
- `browser` namespace (instead of `chrome`)
- Manifest V3 service worker
- Native sync storage

### Cross-Browser Considerations
- Could be adapted for Chrome/Edge with minimal changes
- Would need to replace `browser` with `chrome` API
- Some API differences in storage and commands

## Extension Lifecycle

```
Installation
    ↓
background.js initializes
    ↓
Sets default settings in storage
    ↓
Ready for use
    ↓
User visits a page
    ↓
Content scripts injected (if matches <all_urls>)
    ↓
Scripts wait for user action
    ↓
User triggers reader mode
    ↓
Reader mode activates
    ↓
Settings persist across sessions
    ↓
Extension updates/reloads
    ↓
State preserved in storage
```

## Debugging Tips

### Content Script Debugging
- Open page DevTools (F12)
- Content script logs appear in console
- Use `debugger;` statements for breakpoints

### Background Script Debugging
- Open Browser Console (`Ctrl+Shift+J`)
- Or use `about:debugging` → Inspect
- Background script logs appear here

### Storage Inspection
```javascript
// In browser console
browser.storage.sync.get('readerMode').then(console.log);
```

### Message Debugging
```javascript
// Add to content script
browser.runtime.onMessage.addListener((message) => {
  console.log('Received message:', message);
  // ... handle message
});
```

## Future Enhancements Architecture

### Potential Additions

1. **Custom Content Rules**:
   ```javascript
   {
     "developer.mozilla.org": {
       contentSelector: ".main-page-content",
       hideSelectors: [".sidebar", ".breadcrumbs"]
     }
   }
   ```

2. **Reading Progress**:
   - Track scroll position
   - Estimate reading time
   - Save progress in storage

3. **Annotations**:
   - Allow highlighting text
   - Save notes with page URL
   - Export annotations

## Testing Strategy

### Unit Testing (Manual)
1. Content detection on various sites
2. TOC extraction with different heading structures
3. Settings persistence across sessions
4. Theme switching and visual appearance

### Integration Testing
1. Keyboard shortcuts on different pages
2. Message passing between components
3. Storage sync across Firefox instances

### Edge Cases
- Pages without clear content structure
- Pages without headings
- Very long documents (performance)
- Dynamically loaded content (SPAs)

---

## Quick Reference

### File Responsibilities

| File | Responsibility | Key Functions |
|------|---------------|---------------|
| manifest.json | Configuration | Permissions, commands |
| background.js | Coordination | Command routing |
| toc-extractor.js | TOC logic | Extract, build hierarchy |
| reader.js | Main logic | Content detection, mode toggle |
| reader.css | Styling | Themes, layout |
| popup.html | Settings UI | User interface |
| popup.js | Settings logic | State management |

### Message Types

| Action | Source | Target | Purpose |
|--------|--------|--------|---------|
| toggleReaderMode | Popup/Background | Content | Enable/disable mode |
| updateSettings | Popup | Content | Apply new settings |
| toggleTOC | Popup/Background | Content | Show/hide TOC |
| increaseFontSize | Background | Content | Increment font |
| decreaseFontSize | Background | Content | Decrement font |
| toggleTheme | Background | Content | Cycle themes |
| getStatus | Popup | Content | Query current state |

---

This architecture provides a solid foundation for a maintainable, performant, and user-friendly documentation reader extension.
