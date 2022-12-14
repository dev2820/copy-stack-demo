import itemRepo from "/scripts/itemRepo.js";

const RESPONSE = {
  NEW_CONTENT: "NEW_CONTENT",
  GET_CONTENT_LIST: "GET_CONTENT_LIST",
  DELETE: "DELETE",
};
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
        channel.postMessage({
          action: "GET_CONTENT_LIST",
          payload: itemList,
        });
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

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "store to Copy Stack",
    id: "Store",
    contexts: ["selection", "image"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "Store") {
    if (info.selectionText) {
      await itemRepo.add({
        created: new Date(),
        content: info.selectionText,
      });
    } else if (info.mediaType === "image") {
      const image = await fetch(info.srcUrl);
      const blob = await image.blob();

      await itemRepo.add({
        created: new Date(),
        content: blob,
      });
    }

    const result = await itemRepo.getAll();
    channel.postMessage({
      action: "GET_CONTENT_LIST",
      payload: await itemRepo.getAll(),
    });
  }

  return true;
});

/**
 * onMessage에서 비동기를 쓰려면 return true를 해줘야한다함
 * https://stackoverflow.com/questions/48107746/chrome-extension-message-not-sending-response-undefined
 */
/**
 * blob 데이터는 chrome.runtime.sendMessage를 통해서는 전송이 불가능하다고 함
 * https://groups.google.com/a/chromium.org/g/chromium-extensions/c/8hu2skfKrQ8
 */
/**
 * Clipboard에는 text/plain, text/html, image/png 만 사용 가능하다고 함
 * https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api/
 */
/**
 * listener를 추가하는 작업은 다른 listener 내부에서 하면 안된다고함
 * https://stackoverflow.com/questions/69002482/chrome-extension-contextmenu-listener-not-working-after-few-minutes
 */
