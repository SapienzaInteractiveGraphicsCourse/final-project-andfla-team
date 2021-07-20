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

function gameOver(score) {
    window.onblur = "";
    window.onfocus = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    const gameOverDiv = document.createElement("div");
    gameOverDiv.setAttribute("id", "game-over");
    document.body.appendChild(gameOverDiv);

    const gameOverText = document.createElement("h");
    gameOverText.innerText = "GAME OVER";
    gameOverDiv.appendChild(gameOverText);

    // TODO: sistemare
    const restart = document.createElement("button");
    restart.setAttribute("class", "game-button");
    restart.innerText = "Restart";
    restart.onclick = newGame;
    gameOverDiv.appendChild(restart);

    const menuButt = document.createElement("button");
    menuButt.setAttribute("class", "game-button");
    menuButt.innerText = "Back to menu";
    //menuButt.onclick = menu;
    gameOverDiv.appendChild(menuButt);
}

export {menu, gameOver};