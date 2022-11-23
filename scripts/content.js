"use strict";

document.addEventListener("copy", async (evt) => {
  const text = await navigator.clipboard.readText();

  await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.NEW_CONTENT, text)
  );
});

class Request {
  static ACTIONS = {
    NEW_CONTENT: "NEW_CONTENT",
  };
  static create(action, content) {
    return {
      action,
      content,
    };
  }
}
