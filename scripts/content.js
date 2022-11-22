document.body.style.background = "yellow";

console.log(window.Clipboard);
document.addEventListener("copy", (evt) => {
  console.log(evt.clipboardData);
});
