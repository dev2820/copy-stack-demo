class CopiedItemElement extends HTMLElement {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  connectedCallback() {
    this.render(this.#data);
  }

  render(data) {
    const $template = document.getElementById("copied-item");
    const $container = document.importNode($template.content, true);
    const $content = $container.querySelector(".content");
    const $copyButton = $container.querySelector(".copy");
    const $deleteButton = $container.querySelector(".delete");

    $copyButton.addEventListener("click", () => {
      toClipboard(data.content);
    });
    $deleteButton.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("deleteitem", { detail: { id: data.id } })
      );
    });

    if (data.content instanceof Blob) {
      $content.textContent = data.content.type;
    } else {
      $content.textContent = data.content;
    }

    this.appendChild($container);
  }
}

customElements.define("copied-item", CopiedItemElement);

function toClipboard(data) {
  if (data instanceof Blob) {
    window.navigator.clipboard.write([
      new ClipboardItem({
        [data.type || "text/plain"]: data,
      }),
    ]);
  } else {
    window.navigator.clipboard.writeText(data);
  }
}
