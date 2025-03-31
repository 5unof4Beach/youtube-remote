class Network {
  #PERTAB_INDEX = 3000;
  #MAX_PERTAB_RULES = 200;

  #RESOURCETYPE = Object.values(chrome.declarativeNetRequest.ResourceType);

  async configure() {
    const dps = await new Promise(resolve => chrome.storage.local.get({
      'ua': '',
      'parser': {},
      'userAgentData': true
    }, resolve));

    this.agent = new Agent();
    this.agent.prefs(dps);

    const sps = await new Promise(resolve => chrome.storage.session.get(null, resolve));
    await this.snet(sps);

  }
  action(o, ...types) {
    const r = {
      'type': 'modifyHeaders'
    };
    if (types.includes('net')) {
      r.requestHeaders = [{
        'header': 'user-agent',
        'operation': 'set',
        'value': o.userAgent
      }];
    }
    if (types.includes('js')) {
      r.responseHeaders = [{
        'header': 'Server-Timing',
        'operation': 'append',
        'value': `uasw-json-data;dur=0;desc="${encodeURIComponent(JSON.stringify(o))}"`
      }];
    }
    return r;
  }

  async snet(prefs) {
    const addRules = [];

    let m = this.#PERTAB_INDEX;
    for (const [key, { ua }] of Object.entries(prefs)) {
      const o = this.agent.parse(ua);
      o.type = 'per-tab';

      const tabIds = key.split(',').map(Number);
      addRules.push({
        'id': m,
        'priority': 3,
        'action': this.action(o, 'net'),
        'condition': {
          tabIds,
          'resourceTypes': this.#RESOURCETYPE
        }
      }, {
        'id': m + 1,
        'priority': 1, // to override the global set-cookie with priority 2
        'action': this.action(o, 'js'),
        'condition': {
          tabIds,
          'resourceTypes': ['main_frame', 'sub_frame']
        }
      });

      m += 2;

      if (m > this.#PERTAB_INDEX + this.#MAX_PERTAB_RULES) {
        console.info('max of per-tab rule reach', 'ignoring other tabs');
        break;
      }
    }

    const removeRuleIds = await chrome.declarativeNetRequest.getSessionRules().then(arr => arr.map(o => o.id));
    await chrome.declarativeNetRequest.updateSessionRules({
      addRules,
      removeRuleIds
    }).then(() => addRules.length);

    return addRules.length;
  }

}
