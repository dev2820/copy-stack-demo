window.onload = async () => {
  const contentList = await chrome.runtime.sendMessage({
    action: "GET_CONTENT_LIST",
  });

  const $list = contentList.reduce(($fragment, item) => {
    const $p = createItem(item);
    $fragment.appendChild($p);

    return $fragment;
  }, document.createDocumentFragment());

  document.body.appendChild($list);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "APPEND": {
      /**
       * TODO: new item create
       */
      const $p = createItem(request.content);
      document.body.appendChild($p);
    }
  }
});

function createItem(item) {
  const $p = document.createElement("p");
  $p.innerText = item;

  return $p;
}
