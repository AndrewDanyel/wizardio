let mouseDown = false;
window.keys = {};
let chatVisible = true;

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
