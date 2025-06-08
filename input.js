let mouseDown = false;
window.keys = {};
let chatVisible = true;

window.onload = () => {
  const canvas = document.getElementById("gameCanvas");

  document.addEventListener('keydown', e => {
    window.keys[e.key] = true;
    console.log("KEY DOWN:", e.key); // <- debug
  });

  document.addEventListener('keyup', e => {
    window.keys[e.key] = false;
    console.log("KEY UP:", e.key); // <- debug
  });


  canvas.addEventListener("mousedown", () => { mouseDown = true; });
  canvas.addEventListener("mouseup", () => { mouseDown = false; });

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    wizard.angle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2);
  });
};
