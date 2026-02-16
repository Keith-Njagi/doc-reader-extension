// Documentation Reader - Main Content Script
class DocumentationReader {
  constructor() {
    this.isReaderMode = false;
    this.contentElement = null;
    this.hiddenElements = [];
    this.tocExtractor = new window.TOCExtractor();
    this.tocPanel = null;
    this.settings = {
      enabled: false,
      fontSize: 16,
      contentWidth: 800,
      theme: 'auto',
      showTOC: true
    };
    this.observingScroll = false;

    this.init();
  }

  async init() {
    // Load settings from storage
    await this.loadSettings();

    // Listen for messages from popup
    browser.runtime.onMessage.addListener((message) => {
      this.handleMessage(message);
    });

    // Apply reader mode if it was previously enabled
    if (this.settings.enabled) {
      this.enableReaderMode();
    }
  }

  async loadSettings() {
    try {
      const result = await browser.storage.sync.get('readerMode');
      if (result.readerMode) {
        this.settings = { ...this.settings, ...result.readerMode };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await browser.storage.sync.set({ readerMode: this.settings });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  handleMessage(message) {
    switch (message.action) {
      case 'toggleReaderMode':
        this.toggleReaderMode();
        break;
      case 'updateSettings':
        this.updateSettings(message.settings);
        break;
      case 'toggleTOC':
        this.toggleTOC();
        break;
      case 'increaseFontSize':
        this.adjustFontSize(2);
        break;
      case 'decreaseFontSize':
        this.adjustFontSize(-2);
        break;
      case 'toggleTheme':
        this.cycleTheme();
        break;
      case 'getStatus':
        return Promise.resolve({
          enabled: this.isReaderMode,
          settings: this.settings
        });
    }
  }

  toggleReaderMode() {
    if (this.isReaderMode) {
      this.disableReaderMode();
    } else {
      this.enableReaderMode();
    }
  }

  enableReaderMode() {
    // Find main content
    this.contentElement = this.findMainContent();

    if (!this.contentElement) {
      console.warn('Could not detect main content area');
      return;
    }

    // Hide distracting elements
    this.hideDistractingElements();

    // Apply reader mode wrapper
    this.applyReaderWrapper();

    // Apply settings
    this.applySettings();

    // Create TOC
    if (this.settings.showTOC) {
      this.createTOC();
    }

    this.isReaderMode = true;
    this.settings.enabled = true;
    this.saveSettings();

    document.body.classList.add('doc-reader-active');
  }

  disableReaderMode() {
    // Show hidden elements
    this.showDistractingElements();

    // Remove reader wrapper
    this.removeReaderWrapper();

    // Remove TOC
    this.removeTOC();

    this.isReaderMode = false;
    this.settings.enabled = false;
    this.saveSettings();

    document.body.classList.remove('doc-reader-active');
  }

  findMainContent() {
    // Priority 1: Semantic HTML5 elements
    let content = document.querySelector('article, main, [role="main"]');
    if (content) return content;

    // Priority 2: Common content selectors
    const contentSelectors = [
      '#content', '#main-content', '#article', '#post',
      '.content', '.main-content', '.article', '.post', '.entry-content',
      '[class*="content"]', '[id*="content"]'
    ];

    for (const selector of contentSelectors) {
      content = document.querySelector(selector);
      if (content && this.hasSignificantText(content)) {
        return content;
      }
    }

    // Priority 3: Largest text block
    return this.findLargestTextBlock();
  }

  hasSignificantText(element) {
    const text = element.textContent.trim();
    return text.length > 200; // At least 200 characters
  }

  findLargestTextBlock() {
    let largestElement = null;
    let maxTextLength = 0;

    const candidates = document.querySelectorAll('div, section, article');

    candidates.forEach(element => {
      const textLength = element.textContent.trim().length;
      const childDivs = element.querySelectorAll('div').length;

      // Avoid elements with too many nested divs (likely layout containers)
      if (textLength > maxTextLength && childDivs < 50) {
        maxTextLength = textLength;
        largestElement = element;
      }
    });

    return largestElement;
  }

  hideDistractingElements() {
    this.hiddenElements = [];

    // Elements to hide
    const selectorsToHide = [
      'header', 'footer', 'nav', 'aside',
      '[role="navigation"]', '[role="banner"]', '[role="complementary"]',
      '.header', '.footer', '.nav', '.navigation', '.sidebar', '.menu',
      '.advertisement', '.ad', '.promo', '.social-share'
    ];

    selectorsToHide.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        // Don't hide if it's inside or is the content element
        if (!this.contentElement.contains(element) && element !== this.contentElement) {
          if (element.style.display !== 'none') {
            this.hiddenElements.push({
              element: element,
              originalDisplay: element.style.display
            });
            element.style.display = 'none';
          }
        }
      });
    });
  }

  showDistractingElements() {
    this.hiddenElements.forEach(({ element, originalDisplay }) => {
      element.style.display = originalDisplay;
    });
    this.hiddenElements = [];
  }

  applyReaderWrapper() {
    if (!this.contentElement.classList.contains('doc-reader-content')) {
      this.contentElement.classList.add('doc-reader-content');
    }
  }

  removeReaderWrapper() {
    if (this.contentElement) {
      this.contentElement.classList.remove('doc-reader-content');
    }
  }

  createTOC() {
    // Remove existing TOC if present
    this.removeTOC();

    const tocItems = this.tocExtractor.extract(this.contentElement);

    if (tocItems.length === 0) {
      return;
    }

    // Create TOC panel
    this.tocPanel = document.createElement('div');
    this.tocPanel.className = 'doc-reader-toc-panel';
    this.tocPanel.innerHTML = `
      <div class="doc-reader-toc-header">
        <h3>Contents</h3>
        <button class="doc-reader-toc-close" aria-label="Close TOC">&times;</button>
      </div>
      <div class="doc-reader-toc-content">
        ${this.tocExtractor.generateHTML(tocItems)}
      </div>
    `;

    document.body.appendChild(this.tocPanel);

    // Add event listeners
    this.tocPanel.querySelector('.doc-reader-toc-close').addEventListener('click', () => {
      this.toggleTOC();
    });

    this.tocPanel.querySelectorAll('.doc-reader-toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-id');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Update active link
          this.tocPanel.querySelectorAll('.doc-reader-toc-link').forEach(l => {
            l.classList.remove('active');
          });
          link.classList.add('active');
        }
      });
    });

    // Observe scroll to highlight current section
    this.observeScroll(tocItems);

    // Show with animation
    setTimeout(() => {
      this.tocPanel.classList.add('visible');
    }, 10);
  }

  removeTOC() {
    if (this.tocPanel) {
      this.tocPanel.remove();
      this.tocPanel = null;
    }
    this.observingScroll = false;
  }

  toggleTOC() {
    if (!this.tocPanel) {
      this.createTOC();
      this.settings.showTOC = true;
    } else {
      this.removeTOC();
      this.settings.showTOC = false;
    }
    this.saveSettings();
  }

  observeScroll(tocItems) {
    if (this.observingScroll) return;
    this.observingScroll = true;

    let ticking = false;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      let activeItem = null;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        if (item.element.offsetTop <= scrollPosition) {
          activeItem = item;
          break;
        }
      }

      if (activeItem && this.tocPanel) {
        this.tocPanel.querySelectorAll('.doc-reader-toc-link').forEach(link => {
          link.classList.remove('active');
        });

        const activeLink = this.tocPanel.querySelector(`[data-id="${activeItem.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.applySettings();
    this.saveSettings();
  }

  applySettings() {
    if (!this.contentElement) return;

    const root = document.documentElement;

    // Apply font size
    root.style.setProperty('--doc-reader-font-size', `${this.settings.fontSize}px`);

    // Apply content width
    root.style.setProperty('--doc-reader-content-width', `${this.settings.contentWidth}px`);

    // Apply theme
    this.applyTheme();
  }

  applyTheme() {
    document.body.classList.remove('doc-reader-theme-light', 'doc-reader-theme-dark');

    if (this.settings.theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'doc-reader-theme-dark' : 'doc-reader-theme-light');
    } else {
      document.body.classList.add(`doc-reader-theme-${this.settings.theme}`);
    }
  }

  adjustFontSize(delta) {
    this.settings.fontSize = Math.max(12, Math.min(24, this.settings.fontSize + delta));
    this.applySettings();
    this.saveSettings();
  }

  cycleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(this.settings.theme);
    this.settings.theme = themes[(currentIndex + 1) % themes.length];
    this.applySettings();
    this.saveSettings();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new DocumentationReader();
  });
} else {
  new DocumentationReader();
}
