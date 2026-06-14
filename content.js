let patterns = {};
const seenTokens = new Set();

const genericTerms = new Set([
  "the act", "this act", "said act", "the code", "the treaty", 
  "the section", "the section mentioned", "above rule", 
  "the amendment", "the case", "this judgment", "the verdict"
]);

async function loadDictionary() {
  try {
    const dictionaryUrl = chrome.runtime.getURL('dictionary.json');
    const response = await fetch(dictionaryUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    for (const category in data) {
      patterns[category] = data[category].patterns.map(p => new RegExp(p, 'g'));
    }
    processDocument();
  } catch (error) {
    console.error('LexLink: Error loading dictionary:', error);
  }
}

function shouldFilter(text) {
  return genericTerms.has(text.toLowerCase().trim());
}

function processDocument(rootNode = document.body) {
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (node.parentNode && 
         (node.parentNode.nodeName === 'SCRIPT' || 
          node.parentNode.nodeName === 'STYLE' || 
          node.parentNode.nodeName === 'NOSCRIPT' ||
          node.parentNode.classList.contains('lexlink-match'))) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToProcess = [];
  let currentNode;
  while (currentNode = walker.nextNode()) {
    nodesToProcess.push(currentNode);
  }

  nodesToProcess.forEach(node => {
    let text = node.nodeValue;
    if (!text.trim()) return;

    let matchedAny = false;
    let newHtml = text;

    for (const [category, regexList] of Object.entries(patterns)) {
      regexList.forEach(regex => {
        const matches = [...text.matchAll(regex)];
        matches.forEach(match => {
          const matchText = match[0];
          
          if (shouldFilter(matchText) || seenTokens.has(matchText.toLowerCase().trim())) {
            return;
          }

          seenTokens.add(matchText.toLowerCase().trim());
          matchedAny = true;

          const span = `<span class="lexlink-match type-${category}" data-category="${category}" data-query="${encodeURIComponent(matchText)}">${matchText}</span>`;
          newHtml = newHtml.replace(matchText, span);
        });
      });
    }

    if (matchedAny && newHtml !== text) {
      const wrapper = document.createElement('span');
      wrapper.innerHTML = newHtml;
      node.parentNode.replaceChild(wrapper, node);
    }
  });
}

// Event Delegation for Hover and Click
document.body.addEventListener('mouseover', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('lexlink-match')) {
    e.target.classList.add('lexlink-hover');
  }
});

document.body.addEventListener('mouseout', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('lexlink-match')) {
    e.target.classList.remove('lexlink-hover');
  }
});

let lastSearchTime = 0;
const SEARCH_DELAY_MS = 20000;

document.body.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('lexlink-match')) {
    e.preventDefault();
    e.stopPropagation();
    
    const now = Date.now();
    if (now - lastSearchTime < SEARCH_DELAY_MS) {
      alert(`Please wait ${Math.ceil((SEARCH_DELAY_MS - (now - lastSearchTime)) / 1000)} seconds before opening another search to prevent Google rate-limits.`);
      return;
    }
    lastSearchTime = now;

    const category = e.target.getAttribute('data-category');
    const query = e.target.getAttribute('data-query');
    
    let searchAppend = '';
    if (category === 'statutory_acts') {
      searchAppend = '+filetype:pdf+site:indiacode.nic.in';
    } else if (category === 'case_law') {
      searchAppend = '+filetype:pdf+site:indiankanoon.org';
    } else if (category === 'international_treaties') {
      searchAppend = '+filetype:pdf+(site:un.org OR site:wipo.int)';
    }

    // DuckDuckGo "I'm Feeling Lucky" search using the !ducky bang to bypass Google's redirect notice
    const url = `https://duckduckgo.com/?q=!ducky+${query}${searchAppend}`;

    if (url) {
      chrome.runtime.sendMessage({ action: 'openUrl', url: url });
    }
  }
});

// Set up MutationObserver to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      // Only process Element nodes or text nodes, avoiding our own highlights
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!node.classList || !node.classList.contains('lexlink-match')) {
          processDocument(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentNode && (!node.parentNode.classList || !node.parentNode.classList.contains('lexlink-match'))) {
          processDocument(node.parentNode);
        }
      }
    });
  });
});

function startObserver() {
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadDictionary();
    startObserver();
  });
} else {
  loadDictionary();
  startObserver();
}
