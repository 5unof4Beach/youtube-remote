document.addEventListener('click', ({target}) => {
  const cmd = target.dataset.cmd;
  if (cmd) {
    if (cmd === 'apply') {
      const value = document.getElementById('ua').value;
      if (value === navigator.userAgent) {
        msg(chrome.i18n.getMessage('msgDefaultUA'));
      }
      else {
        msg(chrome.i18n.getMessage('msgUASet'));
      }
      if (value !== navigator.userAgent) {
        // prevent a container ua string from overwriting the default one
        if ('cookieStoreId' in tab && tab.cookieStoreId !== DCSI) {
          chrome.runtime.sendMessage({
            method: 'request-update',
            value,
            cookieStoreId: tab.cookieStoreId
          });
          chrome.storage.local.get({
            'container-uas': {}
          }, prefs => {
            prefs['container-uas'][tab.cookieStoreId] = value;
            chrome.storage.local.set(prefs);
          });
        }
        else {
          chrome.storage.local.set({
            ua: value
          });
        }
      }
    }
    else if (cmd === 'tab') {
      // const value = document.getElementById('ua').value;
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
          setTimeout(()=>{
            chrome.tabs.reload(window.tabs[0].id, {
              bypassCache: true  // Force reload ignoring cache
            });
          }, 500)
        });
      });
    }
    else if (cmd === 'reset') {
      const input = document.querySelector('#list :checked');
      if (input) {
        input.checked = false;
      }
      // prevent a container ua string from overwriting the default one
      if ('cookieStoreId' in tab && tab.cookieStoreId !== DCSI) {
        chrome.runtime.sendMessage({
          method: 'request-update',
          value: '',
          cookieStoreId: tab.cookieStoreId,
          delete: true
        });
        chrome.storage.local.get({
          'container-uas': {}
        }, prefs => {
          delete prefs['container-uas'][tab.cookieStoreId];
          chrome.storage.local.set(prefs);
        });

        msg(chrome.i18n.getMessage('msgDisabledOnContainer'));
      }
      else {
        chrome.storage.local.set({
          ua: ''
        });
        msg(chrome.i18n.getMessage('msgDisabled'));
      }
    }
    else if (cmd === 'refresh') {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, ([tab]) => chrome.tabs.reload(tab.id, {
        bypassCache: true
      }));
    }
    else if (cmd === 'options') {
      chrome.runtime.openOptionsPage();
    }
    else if (cmd === 'reload') {
      chrome.runtime.reload();
    }
    else if (cmd === 'test') {
      chrome.storage.local.get({
        'test': 'https://webbrowsertools.com/useragent/?method=normal&verbose=false'
      }, prefs => chrome.tabs.create({
        url: prefs.test
      }));
    }

    if (cmd) {
      target.classList.add('active');
      setTimeout(() => target.classList.remove('active'), 500);
    }
  }
});
