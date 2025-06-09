const shapes = [];

function spawnShape() {
  if (shapes.length >= 10) return;

  const typeChance = Math.random();
  let shape;

  if (typeChance < 0.6) {
    shape = {
      type: "circle",
      x: Math.random() * mapWidth,
      y: Math.random() * mapHeight,
      radius: 10,
      color: "yellow",
      hp: 1,
      xpValue: 5
    };
  } else if (typeChance < 0.9) {
    shape = {
      type: "triangle",
      x: Math.random() * mapWidth,
      y: Math.random() * mapHeight,
      radius: 20,
      color: "red",
      hp: 2,
      xpValue: 10
    };
  } else {
    shape = {
      type: "hexagon",
      x: Math.random() * mapWidth,
      y: Math.random() * mapHeight,
      radius: 30,
      color: "green",
      hp: 3,
      xpValue: 20
    };
  }

  shapes.push(shape);
}

setInterval(spawnShape, 2000);
