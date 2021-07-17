import {startGame} from './doodleJump.js';

function menu() {
    document.body.innerHTML = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const title = document.createElement("h");
    title.innerText = "Doodle Jump";
    document.body.appendChild(title);

    const startButton = document.createElement("button");
    startButton.setAttribute("class", "menu-button");
    startButton.innerText = "Start";
    startButton.onclick = startGame;
    document.body.appendChild(startButton);
}

export {menu};