chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lexlink-search',
    title: 'Search LexLink & Report Missed Format',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'lexlink-search' && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    const url = `https://duckduckgo.com/?q=!ducky+${query}+filetype:pdf`;
    
    // Open DDG search in new tab
    chrome.tabs.create({ url: url });
    
    // Generate Mailto link to report the format to the creator
    const mailtoUrl = `mailto:iamnobodybaba@gmail.com?subject=LexLink%20Missed%20Regex%20Report&body=The%20following%20text%20was%20manually%20searched:%0A%0A"${query}"%0A%0APlease%20consider%20adding%20a%20regex%20for%20this%20format.`;
    
    chrome.tabs.create({ url: mailtoUrl, active: false });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl' && request.url) {
    chrome.tabs.create({ url: request.url });
  }
});
