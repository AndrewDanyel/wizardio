function checkCollisions() {
  for (let i = wizard.spells.length - 1; i >= 0; i--) {
    const spell = wizard.spells[i];
    for (let j = shapes.length - 1; j >= 0; j--) {
      const shape = shapes[j];
      const dx = spell.x - shape.x;
      const dy = spell.y - shape.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < spell.radius + shape.radius) {
        shape.hp--;
        wizard.spells.splice(i, 1);
        if (shape.hp <= 0) {
          shapes.splice(j, 1);
          wizard.xp += shape.xpValue;
          if (wizard.xp >= wizard.level * 20) {
            wizard.level++;
            wizard.xp = 0;
            wizard.levelMessage = "Level Up! Now level " + wizard.level;
            setTimeout(() => wizard.levelMessage = "", 3000);
          }
        }
        break;
      }
    }
  }

  // Damage from touching shapes
  for (let shape of shapes) {
    const dx = wizard.x - shape.x;
    const dy = wizard.y - shape.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < wizard.radius + shape.radius) {
      if (wizard.hp > 0) wizard.hp--;
      break;
    }
  }
}

setInterval(() => {
  if (wizard.hp < wizard.maxHp) wizard.hp++;
}, 30000);
