window.onload = async () => {
  const contentList = await chrome.runtime.sendMessage({
    action: "GET_CONTENT_LIST",
  });

  const $list = contentList.reduce(($fragment, item) => {
    const $copiedItem = new CopiedItemElement(item);
    $fragment.appendChild($copiedItem);

    return $fragment;
  }, document.createDocumentFragment());

  document.body.appendChild($list);
};
