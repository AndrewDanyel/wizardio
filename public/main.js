const socket = io();
const players = {};

socket.on('chatMessage', data => {
  if (data.id === socket.id) return;

  // Add to chat UI
  addChatMessage(`[Player ${data.id.slice(0, 4)}]: ${data.message}`);

  // Set chat bubble for that player
  if (players[data.id]) {
    players[data.id].chatBubble = data.message;
    players[data.id].chatTimer = 180;
  }
});

socket.on('currentPlayers', allPlayers => {
  for (const id in allPlayers) {
    if (id !== socket.id) {
      players[id] = allPlayers[id];
    }
  }
});

socket.on('newPlayer', data => {
  players[data.id] = data;
});

socket.on('playerMoved', data => {
  if (players[data.id]) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
    players[data.id].angle = data.angle;
  }
});

socket.on('playerDisconnected', id => {
  delete players[id];
});

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

  socket.emit('move', {
    x: wizard.x,
    y: wizard.y,
    angle: wizard.angle,
    name: wizard.name,
    color: wizard.color
  });

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

function drawChatBubble(player) {
  if (!player.chatBubble || player.chatTimer <= 0) return;

  player.chatTimer--;

  const maxWidth = 200;
  const lineHeight = 16;
  const { x: cameraX, y: cameraY } = getCamera();
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";

  const textX = player.x - maxWidth / 2 - cameraX;
  const textY = player.y - player.radius - 20 - cameraY;
  drawWrappedText(player.chatBubble, textX, textY, maxWidth, lineHeight);

  if (player.chatTimer === 0) player.chatBubble = "";
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
  drawChatBubble(wizard);

  for (const id in players) {
    const other = players[id];
    drawShape({
      ...other,
      radius: 20,
      color: "#888"
    });
    drawChatBubble(other);
  }

  wizard.spells.forEach(drawShape);
  shapes.forEach(drawShape);
  drawUI();
  drawMinimap();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
