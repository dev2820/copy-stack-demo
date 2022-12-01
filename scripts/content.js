"use strict";

document.addEventListener("copy", async () => {
  const text = await navigator.clipboard.readText();

  if (!chrome.runtime.sendMessage) return;

  await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.NEW_CONTENT, text)
  );
});

class Request {
  static ACTIONS = {
    NEW_CONTENT: "NEW_CONTENT",
  };
  static create(action, payload) {
    return {
      action,
      payload,
    };
  }
}
