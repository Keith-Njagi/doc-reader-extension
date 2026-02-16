// Table of Contents Extractor
class TOCExtractor {
  constructor() {
    this.headingSelector = 'h1, h2, h3, h4, h5, h6';
  }

  /**
   * Extract table of contents from a given content element
   * @param {HTMLElement} contentElement - The main content container
   * @returns {Array} Array of TOC items with structure
   */
  extract(contentElement) {
    if (!contentElement) {
      return [];
    }

    const headings = contentElement.querySelectorAll(this.headingSelector);
    const tocItems = [];
    let idCounter = 0;

    headings.forEach((heading, index) => {
      // Ensure heading has an ID for linking
      if (!heading.id) {
        heading.id = `doc-reader-heading-${idCounter++}`;
      }

      const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2, etc.
      const text = heading.textContent.trim();

      if (text) {
        tocItems.push({
          id: heading.id,
          text: text,
          level: level,
          element: heading
        });
      }
    });

    return tocItems;
  }

  /**
   * Build hierarchical structure from flat list of headings
   * @param {Array} tocItems - Flat array of TOC items
   * @returns {Array} Hierarchical TOC structure
   */
  buildHierarchy(tocItems) {
    if (tocItems.length === 0) {
      return [];
    }

    const hierarchy = [];
    const stack = [];

    tocItems.forEach(item => {
      const newItem = {
        ...item,
        children: []
      };

      // Find the appropriate parent based on level
      while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        hierarchy.push(newItem);
      } else {
        stack[stack.length - 1].children.push(newItem);
      }

      stack.push(newItem);
    });

    return hierarchy;
  }

  /**
   * Generate HTML for TOC
   * @param {Array} tocItems - Array of TOC items
   * @returns {string} HTML string for TOC
   */
  generateHTML(tocItems) {
    if (tocItems.length === 0) {
      return '<p class="doc-reader-toc-empty">No headings found</p>';
    }

    const hierarchy = this.buildHierarchy(tocItems);
    return this.renderHierarchy(hierarchy);
  }

  /**
   * Render hierarchical TOC as HTML
   * @param {Array} items - Hierarchical TOC items
   * @returns {string} HTML string
   */
  renderHierarchy(items) {
    if (items.length === 0) {
      return '';
    }

    let html = '<ul class="doc-reader-toc-list">';

    items.forEach(item => {
      html += `<li class="doc-reader-toc-item doc-reader-toc-level-${item.level}">`;
      html += `<a href="#${item.id}" class="doc-reader-toc-link" data-id="${item.id}">${this.escapeHTML(item.text)}</a>`;

      if (item.children && item.children.length > 0) {
        html += this.renderHierarchy(item.children);
      }

      html += '</li>';
    });

    html += '</ul>';
    return html;
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Make available globally for reader.js
window.TOCExtractor = TOCExtractor;
