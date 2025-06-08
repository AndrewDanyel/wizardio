let mouseDown = false;
window.keys = {};
let chatVisible = true;

window.addEventListener("keydown", e => {
  window.keys[e.key] = true;
});

window.addEventListener("keyup", e => {
  window.keys[e.key] = false;
});

window.onload = () => {
  const canvas = document.getElementById("gameCanvas");

  canvas.addEventListener("mousedown", () => { mouseDown = true; });
  canvas.addEventListener("mouseup", () => { mouseDown = false; });

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    wizard.angle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2);
  });
};
