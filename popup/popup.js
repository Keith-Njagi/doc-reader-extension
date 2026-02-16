// Popup Settings Manager
class PopupManager {
  constructor() {
    this.settings = {
      enabled: false,
      fontSize: 16,
      contentWidth: 800,
      theme: 'auto',
      showTOC: true
    };

    this.elements = {
      readerToggle: document.getElementById('reader-toggle'),
      fontSize: document.getElementById('font-size'),
      fontSizeValue: document.getElementById('font-size-value'),
      contentWidth: document.getElementById('content-width'),
      contentWidthValue: document.getElementById('content-width-value'),
      themeButtons: document.querySelectorAll('.theme-btn'),
      showTOC: document.getElementById('show-toc')
    };

    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
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
      await this.sendSettingsToContent();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async sendSettingsToContent() {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        await browser.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: this.settings
        });
      }
    } catch (error) {
      console.error('Error sending message to content script:', error);
    }
  }

  async toggleReaderMode() {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        await browser.tabs.sendMessage(tabs[0].id, {
          action: 'toggleReaderMode'
        });
      }
    } catch (error) {
      console.error('Error toggling reader mode:', error);
    }
  }

  setupEventListeners() {
    // Reader mode toggle
    this.elements.readerToggle.addEventListener('change', async () => {
      this.settings.enabled = this.elements.readerToggle.checked;
      await this.saveSettings();
      await this.toggleReaderMode();
    });

    // Font size slider
    this.elements.fontSize.addEventListener('input', () => {
      const value = parseInt(this.elements.fontSize.value);
      this.settings.fontSize = value;
      this.elements.fontSizeValue.textContent = `${value}px`;
    });

    this.elements.fontSize.addEventListener('change', async () => {
      await this.saveSettings();
    });

    // Content width slider
    this.elements.contentWidth.addEventListener('input', () => {
      const value = parseInt(this.elements.contentWidth.value);
      this.settings.contentWidth = value;
      this.elements.contentWidthValue.textContent = `${value}px`;
    });

    this.elements.contentWidth.addEventListener('change', async () => {
      await this.saveSettings();
    });

    // Theme buttons
    this.elements.themeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const theme = button.getAttribute('data-theme');
        this.settings.theme = theme;
        this.updateThemeButtons();
        await this.saveSettings();
      });
    });

    // Show TOC toggle
    this.elements.showTOC.addEventListener('change', async () => {
      this.settings.showTOC = this.elements.showTOC.checked;
      await this.saveSettings();
    });
  }

  updateUI() {
    // Update reader mode toggle
    this.elements.readerToggle.checked = this.settings.enabled;

    // Update font size
    this.elements.fontSize.value = this.settings.fontSize;
    this.elements.fontSizeValue.textContent = `${this.settings.fontSize}px`;

    // Update content width
    this.elements.contentWidth.value = this.settings.contentWidth;
    this.elements.contentWidthValue.textContent = `${this.settings.contentWidth}px`;

    // Update theme buttons
    this.updateThemeButtons();

    // Update TOC toggle
    this.elements.showTOC.checked = this.settings.showTOC;
  }

  updateThemeButtons() {
    this.elements.themeButtons.forEach(button => {
      const theme = button.getAttribute('data-theme');
      if (theme === this.settings.theme) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}

// Initialize popup manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
