// Background Service Worker - Keyboard Shortcuts Handler

// Listen for keyboard commands
browser.commands.onCommand.addListener(async (command) => {
  try {
    // Get the active tab
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });

    if (tabs.length === 0) {
      console.warn('No active tab found');
      return;
    }

    const tabId = tabs[0].id;

    // Map commands to actions
    const actionMap = {
      'toggle-reader-mode': 'toggleReaderMode',
      'toggle-toc': 'toggleTOC',
      'decrease-font': 'decreaseFontSize',
      'increase-font': 'increaseFontSize',
      'toggle-theme': 'toggleTheme'
    };

    const action = actionMap[command];

    if (!action) {
      console.warn(`Unknown command: ${command}`);
      return;
    }

    // Send message to content script
    await browser.tabs.sendMessage(tabId, { action });

  } catch (error) {
    console.error('Error handling command:', error);
  }
});

// Listen for extension icon click (optional fallback)
browser.action.onClicked.addListener(async (tab) => {
  try {
    // Get current status
    const response = await browser.tabs.sendMessage(tab.id, {
      action: 'getStatus'
    });

    // Toggle reader mode
    await browser.tabs.sendMessage(tab.id, {
      action: 'toggleReaderMode'
    });
  } catch (error) {
    console.error('Error toggling from icon:', error);
  }
});

// Handle extension installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Documentation Reader extension installed');

    // Set default settings
    browser.storage.sync.set({
      readerMode: {
        enabled: false,
        fontSize: 16,
        contentWidth: 800,
        theme: 'auto',
        showTOC: true
      }
    });
  } else if (details.reason === 'update') {
    console.log('Documentation Reader extension updated');
  }
});

// Optional: Badge to show reader mode status
async function updateBadge(tabId, enabled) {
  try {
    if (enabled) {
      await browser.action.setBadgeText({ text: 'ON', tabId });
      await browser.action.setBadgeBackgroundColor({ color: '#667eea', tabId });
    } else {
      await browser.action.setBadgeText({ text: '', tabId });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}

// Listen for messages from content script to update badge
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'updateBadge' && sender.tab) {
    updateBadge(sender.tab.id, message.enabled);
  }
});
