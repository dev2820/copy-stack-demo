window.onload = async () => {
  const contentList = await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.GET_CONTENT_LIST)
  );

  const $list = contentList.reduce(($fragment, item) => {
    const $copiedItem = new CopiedItemElement(item);
    $fragment.appendChild($copiedItem);

    return $fragment;
  }, document.createDocumentFragment());

  document.body.appendChild($list);
};

class Request {
  static ACTIONS = {
    GET_CONTENT_LIST: "GET_CONTENT_LIST",
  };
  static create(action, payload) {
    return {
      action,
      payload,
    };
  }
}
