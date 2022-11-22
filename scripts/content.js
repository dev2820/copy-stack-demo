document.addEventListener("copy", async (evt) => {
  const text = await navigator.clipboard.readText();

  await chrome.runtime.sendMessage({
    action: "NEW_CONTENT",
    content: text,
  });
});
