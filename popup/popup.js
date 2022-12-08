const channel = new BroadcastChannel("MY_BROADCAST");
channel.onmessage = (msg) => {
  if (msg.data.action === "GET_CONTENT_LIST") {
    render(msg.data.payload);
  }
};

window.onload = async () => {
  await updateContentList();
};

window.addEventListener("deleteitem", async (evt) => {
  const isSuccess = await deleteItem(evt.detail.id);

  if (isSuccess) {
    await updateContentList();
  }
});

async function updateContentList() {
  const isSuccess = await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.GET_CONTENT_LIST)
  );

  return isSuccess;
}

async function deleteItem(itemId) {
  const isSuccess = await chrome.runtime.sendMessage(
    Request.create(Request.ACTIONS.DELETE, itemId)
  );

  return isSuccess;
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
