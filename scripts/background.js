import itemRepo from "/scripts/itemRepo.js";

const RESPONSE = {
  NEW_CONTENT: "NEW_CONTENT",
  GET_CONTENT_LIST: "GET_CONTENT_LIST",
  DELETE: "DELETE",
};
chrome.runtime.onInstalled.addListener(() => {
  const channel = new BroadcastChannel("MY_BROADCAST");
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case RESPONSE.NEW_CONTENT: {
        itemRepo.add({ created: new Date(), content: message.payload });
        sendResponse(true);
        return false;
      }
      case RESPONSE.GET_CONTENT_LIST: {
        itemRepo.getAll().then((itemList) => {
          channel.postMessage(itemList);
          sendResponse(true);
        });

        return true;
      }
      case RESPONSE.DELETE: {
        itemRepo
          .remove(message.payload)
          .then((isSuccess) => sendResponse(isSuccess));

        return true;
      }
    }

    return true;
  });

  chrome.contextMenus.create({
    title: "My Context Menu",
    id: "MyContext",
    contexts: ["selection", "image"],
  });

  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "MyContext") {
      if (info.selectionText) {
        itemRepo.add({ created: new Date(), content: info.selectionText });
      } else if (info.mediaType === "image") {
        const image = await fetch(info.srcUrl);
        const blob = await image.blob();

        itemRepo.add({
          created: new Date(),
          content: blob,
        });
      }
    }

    return true;
  });
});

/**
 * onMessage에서 비동기를 쓰려면 return true를 해줘야한다함
 * https://stackoverflow.com/questions/48107746/chrome-extension-message-not-sending-response-undefined
 */
