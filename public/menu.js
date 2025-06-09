document.getElementById("startButton").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    const color = document.getElementById("colorInput").value;

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    wizard.name = name;
    wizard.color = color;

    document.getElementById("menu").style.display = "none";
});
