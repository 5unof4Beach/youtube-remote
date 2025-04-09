class Network {
  #PERTAB_INDEX = 3000;
  #RESOURCETYPE = Object.values(chrome.declarativeNetRequest.ResourceType);

  async configure() {
    const sps = await new Promise(resolve => chrome.storage.session.get(null, resolve));
    await this.snet(sps);
  }

  action(userAgentString) {
    const r = {
      'type': 'modifyHeaders',
      requestHeaders: [{
        'header': 'user-agent',
        'operation': 'set',
        'value': userAgentString
      }]
    };
    return r;
  }

  async snet(prefs) {
    const addRules = [];

    let nextRuleId = this.#PERTAB_INDEX;
    for (const [key, { ua: userAgent }] of Object.entries(prefs)) {
      const tabIds = key.split(',').map(Number);
      addRules.push({
        'id': nextRuleId,
        'priority': 3,
        'action': this.action(userAgent),
        'condition': {
          tabIds,
          'resourceTypes': this.#RESOURCETYPE
        }
      });

      nextRuleId += 1;
    }

    const removeRuleIds = await chrome.declarativeNetRequest.getSessionRules().then(rulesArray => rulesArray.map(rule => rule.id));
    await chrome.declarativeNetRequest.updateSessionRules({
      addRules,
      removeRuleIds
    });

    return addRules.length;
  }
}
