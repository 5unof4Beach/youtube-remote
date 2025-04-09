if (typeof importScripts !== 'undefined') {
  self.importScripts('network.js');
}

const network = new Network();

chrome.storage.onChanged.addListener(() => {network.configure();});
chrome.runtime.onStartup.addListener(() => network.configure());
chrome.runtime.onInstalled.addListener(() => network.configure());



