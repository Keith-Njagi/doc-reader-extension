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
   * Generate DOM element for TOC
   * @param {Array} tocItems - Array of TOC items
   * @returns {HTMLElement} DOM element for TOC
   */
  generateDOM(tocItems) {
    if (tocItems.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'doc-reader-toc-empty';
      empty.textContent = 'No headings found';
      return empty;
    }

    const hierarchy = this.buildHierarchy(tocItems);
    return this.renderHierarchyDOM(hierarchy);
  }

  /**
   * Render hierarchical TOC as DOM
   * @param {Array} items - Hierarchical TOC items
   * @returns {HTMLElement} DOM element
   */
  renderHierarchyDOM(items) {
    if (items.length === 0) {
      return null;
    }

    const ul = document.createElement('ul');
    ul.className = 'doc-reader-toc-list';

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `doc-reader-toc-item doc-reader-toc-level-${item.level}`;

      const link = document.createElement('a');
      link.href = `#${item.id}`;
      link.className = 'doc-reader-toc-link';
      link.setAttribute('data-id', item.id);
      link.textContent = item.text;

      li.appendChild(link);

      if (item.children && item.children.length > 0) {
        const childUl = this.renderHierarchyDOM(item.children);
        if (childUl) {
          li.appendChild(childUl);
        }
      }

      ul.appendChild(li);
    });

    return ul;
  }
}

// Make available globally for reader.js
window.TOCExtractor = TOCExtractor;
