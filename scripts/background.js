const contentList = [];
const RESPONSE = {
  NEW_CONTENT: "NEW_CONTENT",
  GET_CONTENT_LIST: "GET_CONTENT_LIST",
};
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.action) {
    case RESPONSE.NEW_CONTENT: {
      contentList.push(message.payload);
    }
    case RESPONSE.GET_CONTENT_LIST: {
      sendResponse(contentList);
    }
  }
});
