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
    const $container = document.createElement("div");
    const $copyButton = document.createElement("button");

    $copyButton.addEventListener("click", () => {
      window.navigator.clipboard.writeText(data);
    });
    $copyButton.textContent = "copy";
    $container.textContent = data;

    $container.appendChild($copyButton);
    this.appendChild($container);
  }
}

customElements.define("copied-item", CopiedItemElement);
