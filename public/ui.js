function getCamera() {
  return {
    x: wizard.x - canvas.width / 2,
    y: wizard.y - canvas.height / 2
  };
}

function drawGrid() {
  const { x: cameraX, y: cameraY } = getCamera();
  const gridSize = 50;

  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;

  for (let x = 0; x <= mapWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x - cameraX, 0 - cameraY);
    ctx.lineTo(x - cameraX, mapHeight - cameraY);
    ctx.stroke();
  }

  for (let y = 0; y <= mapHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0 - cameraX, y - cameraY);
    ctx.lineTo(mapWidth - cameraX, y - cameraY);
    ctx.stroke();
  }
}

function drawShape(obj) {
  const { x: cameraX, y: cameraY } = getCamera();
  const cx = obj.x - cameraX;
  const cy = obj.y - cameraY;

  ctx.fillStyle = obj.color;

  // Draw shape
  if (obj.type === "triangle") {
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = Math.PI * 2 * i / 3 - Math.PI / 2;
      const px = cx + Math.cos(angle) * obj.radius;
      const py = cy + Math.sin(angle) * obj.radius;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (obj.type === "hexagon") {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 2 * i / 6;
      const px = cx + Math.cos(angle) * obj.radius;
      const py = cy + Math.sin(angle) * obj.radius;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, obj.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // ✅ Draw name above shape if present
  if (obj.name) {
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(obj.name, cx, cy - obj.radius - 10);
  }
}


function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let yy = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[n] + " ";
      yy += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, yy);
}

function drawUI() {
  const { x: cameraX, y: cameraY } = getCamera();

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("XP: " + wizard.xp + " / " + (wizard.level * 20), 50, 30);
  ctx.fillText("Level: " + wizard.level, 50, 50);
  ctx.fillText("HP: " + wizard.hp + " / " + wizard.maxHp, 50, 70);

  if (wizard.levelMessage) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText(wizard.levelMessage, canvas.width / 2 - 100, 60);
  }

  if (wizard.chatBubble) {
    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    const maxWidth = 200;
    const lineHeight = 16;
    ctx.textAlign = "center";
    const textX = wizard.x - cameraX;
    const textY = wizard.y - wizard.radius - 20 - cameraY;
    drawWrappedText(wizard.chatBubble, textX, textY, maxWidth, lineHeight);
    ctx.textAlign = "start";
  }
}

function drawMinimap() {
  const mapScale = 0.1;
  const width = mapWidth * mapScale;
  const height = mapHeight * mapScale;
  const x = canvas.width - width - 20;
  const y = canvas.height - height - 20;

  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = "purple";
  ctx.beginPath();
  ctx.arc(x + wizard.x * mapScale, y + wizard.y * mapScale, 3, 0, 2 * Math.PI);
  ctx.fill();

  shapes.forEach(shape => {
    ctx.fillStyle = shape.color || "white";
    ctx.beginPath();
    ctx.arc(x + shape.x * mapScale, y + shape.y * mapScale, 2, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function updateChatBubble() {
  if (wizard.chatTimer > 0) {
    wizard.chatTimer--;
    if (wizard.chatTimer === 0) wizard.chatBubble = "";
  }
}
