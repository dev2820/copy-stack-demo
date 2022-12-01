window.onload = async () => {
  const contentList = await getContentList();
  render(contentList);
};
window.addEventListener("deleteitem", async (evt) => {
  const isSuccess = await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.DELETE, evt.detail.id)
  );

  if (isSuccess) {
    const contentList = await getContentList();
    render(contentList);
  }
});

async function getContentList() {
  const contentList = await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.GET_CONTENT_LIST)
  );
  return contentList;
}
function render(contentList) {
  const $itemList = document.getElementById("item-list");
  $itemList.innerHTML = "";
  const $list = contentList.reduce(($fragment, item) => {
    const $copiedItem = new CopiedItemElement(item);
    $fragment.appendChild($copiedItem);

    return $fragment;
  }, document.createDocumentFragment());

  $itemList.appendChild($list);
}
class Request {
  static ACTIONS = {
    GET_CONTENT_LIST: "GET_CONTENT_LIST",
    DELETE: "DELETE",
  };
  static create(action, payload) {
    return {
      action,
      payload,
    };
  }
}
