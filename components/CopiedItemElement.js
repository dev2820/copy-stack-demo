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

    $copyButton.addEventListener("click", () => {
      window.navigator.clipboard.writeText(data);
    });
    $copyButton.textContent = "copy";
    $content.textContent = data;

    this.appendChild($container);
  }
}

customElements.define("copied-item", CopiedItemElement);
