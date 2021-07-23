import {startGame} from './foxyJumper.js';

function play() {
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

    const restart = document.createElement("button");
    restart.setAttribute("class", "button");
    restart.innerText = "Restart";
    restart.onclick = startGame;
    gameOverDiv.appendChild(restart);

    const menuButt = document.createElement("button");
    menuButt.setAttribute("class", "button");
    menuButt.innerText = "Go to menu";
    menuButt.onclick =  function() {
        window.location.href = repository_name + 'index.html';
    };
    gameOverDiv.appendChild(menuButt);
}

export {play, gameOver};
