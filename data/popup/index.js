document.addEventListener('DOMContentLoaded', function() {
  const openButton = document.getElementById('open-youtube-button');
  
  openButton.addEventListener('click', () => {
    const ua = "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1"
    const url = 'https://www.youtube.com/tv/guest'

    chrome.windows.create({
      url,
      type: 'popup'
    }, (window) => {
      chrome.storage.session.set({
        [window.tabs[0].id]: {
          ua,
          cookieStoreId: window.tabs[0].cookieStoreId
        }
      }, () => {
        setTimeout(() => {
          chrome.tabs.reload(window.tabs[0].id, {
            bypassCache: true
          });
        }, 500);
      });
    });
  });

  const currentYear = new Date().getFullYear();
  const footerYearElement = document.getElementById('footer-year');
  if (footerYearElement) {
    footerYearElement.textContent = currentYear;
  }
});
