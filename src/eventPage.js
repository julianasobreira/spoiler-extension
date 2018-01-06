chrome.contextMenus.create({
  id: "spoilerAlert",
  title: "Encode Spoiler",
  contexts: ["editable"]
});

chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId === "spoilerAlert" && info.selectionText) {
    console.log("yeah");
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "encode" });
      }
    );
  }
});
