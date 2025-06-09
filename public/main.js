const socket = io();
const players = {};
window.gameStarted = false;

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
      players[id] = { ...allPlayers[id], spells: [] };
    }
  }
});

socket.on('newPlayer', data => {
  players[data.id] = { ...data, spells: [] };
});

socket.on('playerUpdated', data => {
  if (players[data.id]) {
    players[data.id] = { ...players[data.id], ...data };
  }
});

socket.on('spellShot', data => {
  if (players[data.id]) {
    players[data.id].spells.push(data.spell);
  }
});

socket.on('takeDamage', () => {
  if (wizard.hp > 0) wizard.hp--;
});

socket.on('playerMoved', data => {
  if (players[data.id]) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
    players[data.id].angle = data.angle;
    if (data.name) players[data.id].name = data.name;
    if (data.color) players[data.id].color = data.color;
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
  if (!window.gameStarted) return;
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
  if (!window.gameStarted) return;
  wizard.spells.forEach(spell => {
    spell.x += Math.cos(spell.angle) * spell.speed;
    spell.y += Math.sin(spell.angle) * spell.speed;
  });

  for (const id in players) {
    players[id].spells.forEach(spell => {
      spell.x += Math.cos(spell.angle) * spell.speed;
      spell.y += Math.sin(spell.angle) * spell.speed;
    });

    players[id].spells = players[id].spells.filter(spell =>
      spell.x > 0 && spell.x < mapWidth &&
      spell.y > 0 && spell.y < mapHeight
    );
  }

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

  ctx.textAlign = "center";
  const textX = player.x - cameraX;
  const textY = player.y - player.radius - 20 - cameraY;
  drawWrappedText(player.chatBubble, textX, textY, maxWidth, lineHeight);
  ctx.textAlign = "start";

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
  if (wizard.invincibility > 0) wizard.invincibility--;

  drawShape(wizard);
  drawChatBubble(wizard);

  for (const id in players) {
    const other = players[id];
    drawShape({
      ...other,
      radius: 20,
      color: other.color || "#888"
    });
    drawChatBubble(other);
    other.spells.forEach(drawShape);
  }

  wizard.spells.forEach(drawShape);
  shapes.forEach(drawShape);
  drawUI();
  drawMinimap();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
