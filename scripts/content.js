"use strict";

document.addEventListener("copy", async () => {
  const text = await navigator.clipboard.readText();

  if (!chrome.runtime.sendMessage) return;

  await chrome.runtime.sendMessage(
    Requester.create(Requester.ACTIONS.NEW_CONTENT, text)
  );
});

class Requester {
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
