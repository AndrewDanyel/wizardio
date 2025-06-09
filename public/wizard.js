const wizard = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  radius: 20,
  name: "",
  color: "#6a0dad",
  speed: 3,
  angle: 0,
  spells: [],
  xp: 0,
  level: 1,
  hp: 10,
  maxHp: 10,
  levelMessage: "",
  chatBubble: "",
  chatTimer: 0,
  invincibility: 0
};

window.shootSpell = function () {
  if (!window.gameStarted) return;
  console.log("Spell shot");
  wizard.spells.push({
    x: wizard.x,
    y: wizard.y,
    angle: wizard.angle,
    speed: 6,
    radius: 5,
    color: "cyan"
  });
  if (typeof socket !== 'undefined') {
    socket.emit('shootSpell', {
      x: wizard.x,
      y: wizard.y,
      angle: wizard.angle,
      speed: 6,
      radius: 5,
      color: 'cyan'
    });
  }
};

