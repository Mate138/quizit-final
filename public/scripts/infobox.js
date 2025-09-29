// infobox.js
let infoBox, infoBoxTitle, closeBtn;

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  infoBox = document.querySelector(".info");
  infoBoxTitle = infoBox.querySelector(".info__title");
  closeBtn = infoBox.querySelector(".info__close");

  // Close button hides the info box
  closeBtn.addEventListener("click", hideInfo);
});

export function alertInfo(text, duration = 3000) {
  if (!infoBox) return; // safety check
  infoBox.style.backgroundColor = "#5085f8ff";
  document.body.style.backgroundClip;
  infoBoxTitle.innerText = text;
  infoBox.classList.add("show");

  // Auto-hide after duration
  setTimeout(() => {
    hideInfo();
  }, duration);
}

export function alertWarn(text, duration = 3000) {
  if (!infoBox) return; // safety check
  infoBox.style.backgroundColor = "#f85050";

  infoBoxTitle.innerText = text;
  infoBox.classList.add("show");

  // Auto-hide after duration
  setTimeout(() => {
    hideInfo();
  }, duration);
}

function hideInfo() {
  if (!infoBox) return;
  infoBox.classList.remove("show");
}
