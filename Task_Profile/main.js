const timeEl = document.querySelector('[data-testid="test-user-time"]');
const avatarEl = document.querySelector('[data-testid="test-user-avatar"]');
const uploadInput = document.getElementById("avatar-upload");

function renderTime() {
  timeEl.textContent = String(Date.now());
}

renderTime();
setInterval(renderTime, 750);

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files && uploadInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  avatarEl.src = url;
  avatarEl.alt = `Uploaded profile image: ${file.name}`;
});
