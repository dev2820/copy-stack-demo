const contentList = [];
let counter = 0;
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case "NEW_CONTENT": {
      contentList.push(message.content);

      await chrome.runtime.sendMessage({
        action: "APPEND",
        content: message.content,
      });
    }
    case "GET_CONTENT_LIST": {
      sendResponse(contentList);
    }
    case "ADD": {
      counter++;
    }
    case "GET_COUNTER": {
      sendResponse(counter);
    }
  }
});
