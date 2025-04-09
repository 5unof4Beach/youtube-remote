class Network {
  #PERTAB_INDEX = 3000;
  #RESOURCETYPE = Object.values(chrome.declarativeNetRequest.ResourceType);

  async configure() {
    const sps = await new Promise((resolve) =>
      chrome.storage.session.get(null, resolve)
    );
    await this.updateRules(sps);
  }

  action(userAgentString) {
    return {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "user-agent",
          operation: "set",
          value: userAgentString,
        },
      ],
    };
  }

  async updateRules(prefs) {
    const addRules = Object.entries(prefs).map(
      ([key, { ua: userAgent }], index) => ({
        id: this.#PERTAB_INDEX + index,
        priority: 3,
        action: this.action(userAgent),
        condition: {
          tabIds: key.split(",").map(Number),
          resourceTypes: this.#RESOURCETYPE,
        },
      })
    );

    const removeRuleIds = (
      await chrome.declarativeNetRequest.getSessionRules()
    ).map((rule) => rule.id);

    await chrome.declarativeNetRequest.updateSessionRules({
      addRules,
      removeRuleIds,
    });

    return addRules.length;
  }
}
