document.addEventListener('click', ({ target }) => {

  const value = "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1"
  // Open YouTube TV in a new window and get the tab ID
  chrome.windows.create({
    url: 'https://www.youtube.com/tv',
    type: 'popup'
  }, (window) => {
    // Set user agent for both current tab and new tab
    chrome.storage.session.set({
      [window.tabs[0].id]: {  // Set UA for the new tab
        ua: value,
        cookieStoreId: window.tabs[0].cookieStoreId
      }
    }, () => {
      setTimeout(() => {
        chrome.tabs.reload(window.tabs[0].id, {
          bypassCache: true  // Force reload ignoring cache
        });
      }, 500)
    });
  });

});
