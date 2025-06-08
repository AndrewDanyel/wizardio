const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mapWidth = 2000;
const mapHeight = 2000;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let lastShotTime = 0;
const shootCooldown = 200;

function moveWizard() {
  if (window.keys["w"] || window.keys["ArrowUp"]) wizard.y -= wizard.speed;
  if (window.keys["s"] || window.keys["ArrowDown"]) wizard.y += wizard.speed;
  if (window.keys["a"] || window.keys["ArrowLeft"]) wizard.x -= wizard.speed;
  if (window.keys["d"] || window.keys["ArrowRight"]) wizard.x += wizard.speed;

  wizard.x = Math.max(0, Math.min(mapWidth, wizard.x));
  wizard.y = Math.max(0, Math.min(mapHeight, wizard.y));
}

function updateSpells() {
  wizard.spells.forEach(spell => {
    spell.x += Math.cos(spell.angle) * spell.speed;
    spell.y += Math.sin(spell.angle) * spell.speed;
  });

  wizard.spells = wizard.spells.filter(spell =>
    spell.x > 0 && spell.x < mapWidth &&
    spell.y > 0 && spell.y < mapHeight
  );
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  moveWizard();

  if (mouseDown && (!lastShotTime || timestamp - lastShotTime > shootCooldown)) {
    shootSpell();
    lastShotTime = timestamp;
  }

  updateSpells();
  checkCollisions();
  updateChatBubble();

  drawShape(wizard);
  wizard.spells.forEach(drawShape);
  shapes.forEach(drawShape);
  drawUI();
  drawMinimap();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
