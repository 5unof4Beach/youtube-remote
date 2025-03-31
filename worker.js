/* global Network */

if (typeof importScripts !== 'undefined') {
  self.importScripts('external/ua-parser.min.js', 'agent.js', 'network.js');
}

const network = new Network();

chrome.storage.onChanged.addListener(() => {network.configure();});
chrome.runtime.onStartup.addListener(() => network.configure());
chrome.runtime.onInstalled.addListener(() => network.configure());



