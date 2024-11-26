function initContextMenu() {
    chrome.contextMenus.create({
        id: 'memory-visualizer-word',
        title: 'Add to Memory Visualizer',
        contexts: ['all']
    });
}

chrome.runtime.onInstalled.addListener(() => {
    initContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
    if(data.menuItemId === "memory-visualizer-word") {
        chrome.storage.session.set({lastVisializerWord: data.selectionText});
        chrome.sidePanel.open({tabId: tab.id});
    }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));