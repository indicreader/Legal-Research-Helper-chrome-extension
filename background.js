chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openUrl' && request.url) {
    chrome.tabs.create({ url: request.url });
  }
});
