let mouseDown = false;
window.keys = {};
let chatVisible = true;

window.onload = () => {
  const canvas = document.getElementById("gameCanvas");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  document.addEventListener('keydown', e => {
    window.keys[e.key] = true;

    if (e.key.toLowerCase() === 't' && document.activeElement !== chatInput) {
      chatVisible = !chatVisible;
      document.getElementById('chat').style.display = chatVisible ? 'block' : 'none';
    }
  });

  document.addEventListener('keyup', e => {
    window.keys[e.key] = false;
  });

  canvas.addEventListener("mousedown", () => { mouseDown = true; });
  canvas.addEventListener("mouseup", () => { mouseDown = false; });

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    wizard.angle = Math.atan2(mouseY - canvas.height / 2, mouseX - canvas.width / 2);
  });

  // Handle chat input and socket emission
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const msg = chatInput.value.trim();

      // Emit to server
      socket.emit('chatMessage', msg);

      // Show your own message immediately
      addChatMessage(`[You]: ${msg}`);
      wizard.chatBubble = msg;
      wizard.chatTimer = 180;

      chatInput.value = "";
    }
  });

  // Function to append chat messages to UI
  window.addChatMessage = function (msg) {
    const msgEl = document.createElement("div");
    msgEl.textContent = msg;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
};
