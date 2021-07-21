import {startGame} from './doodleJump.js';

function menu() {
    document.body.innerHTML = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    startGame();
}


function gameOver(score) {
    document.body.innerHTML = "";
    window.onblur = "";
    window.onfocus = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const gameOverDiv = document.createElement("div");
    gameOverDiv.setAttribute("id", "gameOver");
    document.body.appendChild(gameOverDiv);

    const gameOverText = document.createElement("h");
    gameOverText.innerText = "GAME OVER \n FINAL SCORE: " + score;
    gameOverDiv.appendChild(gameOverText);

    // TODO: sistemare
    const restart = document.createElement("button");
    restart.setAttribute("class", "button");
    restart.innerText = "Restart";
    restart.onclick = startGame;
    gameOverDiv.appendChild(restart);

    const menuButt = document.createElement("button");
    menuButt.setAttribute("class", "button");
    menuButt.innerText = "Back to menu";
    menuButt.onclick = menu;
    gameOverDiv.appendChild(menuButt);
}

export {menu, gameOver};
