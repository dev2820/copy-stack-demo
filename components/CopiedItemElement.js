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

    $copyButton.addEventListener("click", async () => {
      await toClipboard(data.content);
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

async function toClipboard(data) {
  if (data instanceof Blob) {
    const pngBlob = await convert2Png(data);
    window.navigator.clipboard.write([
      new ClipboardItem({
        [pngBlob.type]: pngBlob,
      }),
    ]);
  } else {
    window.navigator.clipboard.writeText(data);
  }
}

async function convert2Png(blob) {
  if (blob.type === "image/png") return blob;

  const $img = await new Promise((resolve) => {
    const _$img = document.createElement("img");
    _$img.crossOrigin = "Anonymous";
    _$img.src = URL.createObjectURL(blob);
    _$img.addEventListener("load", () => {
      resolve(_$img);
    });
  });

  const $canvas = document.createElement("canvas");
  $canvas.width = $img.width;
  $canvas.height = $img.height;

  const ctx = $canvas.getContext("2d");
  ctx.drawImage($img, 0, 0);

  return await new Promise((resolve) => {
    $canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}
