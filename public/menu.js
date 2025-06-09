const startButton = document.getElementById("startButton");
const colorInput = document.getElementById("colorInput");

// preview color on the color input/button itself
function updateColorPreview() {
    colorInput.style.backgroundColor = colorInput.value;
}
colorInput.addEventListener("input", updateColorPreview);
updateColorPreview();

startButton.addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    const color = colorInput.value;

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    wizard.name = name;
    wizard.color = color;

    socket.emit('playerInfo', { name, color });

    document.getElementById("menu").style.display = "none";
    document.getElementById("gameCanvas").classList.remove("blurred");
    window.gameStarted = true;
});
