document.addEventListener('click', ({ target }) => {
  const cmd = target.dataset.cmd;

  if (cmd && cmd === "tab") {

    const value = "Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1"
    chrome.windows.create({
      url: 'https://www.youtube.com/tv',
      type: 'popup'
    }, (window) => {
      chrome.storage.session.set({
        [window.tabs[0].id]: {
          ua: value,
          cookieStoreId: window.tabs[0].cookieStoreId
        }
      }, () => {
        setTimeout(() => {
          chrome.tabs.reload(window.tabs[0].id, {
            bypassCache: true
          });
        }, 500)
      });
    });
  }

});

document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const footerYearElement = document.getElementById('footer-year');
    if (footerYearElement) {
        footerYearElement.textContent = currentYear;
    }
});
