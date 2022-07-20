import Tile from "./Tile.js";
import Grid from "/Grid.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);

//initial two tiles creation 
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
// function to setInput using an Event Listener 
function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    switch (e.key) {
      case "ArrowUp":
        if (!canMoveUp()) {
          setupInput()
          return
        }
        await moveUp()
        break
      case "ArrowDown":
        if (!canMoveDown()) {
          setupInput()
          return
        }
        await moveDown()
        break
      case "ArrowLeft":
        if (!canMoveLeft()) {
          setupInput()
          return
        }
        await moveLeft()
        break
      case "ArrowRight":
        if (!canMoveRight()) {
          setupInput()
          return
        }
        await moveRight()
        break
      default:
        setupInput()
        return
    }
  
    grid.cells.forEach(cell => cell.mergeTiles())
  
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile
  
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      newTile.waitForTransition(true).then(() => {
        tryAgain();
      })
      return
    }
  
    setupInput()
  }
function moveUp() {
    return slideTiles(grid.cellByCol)
}
function moveDown() {
    return slideTiles(grid.cellByCol.map(col => [...col].reverse()))
}
function moveLeft() {
    return slideTiles(grid.cellByRow)
}
function moveRight() {
    return slideTiles(grid.cellByRow.map(col => [...col].reverse()))
}
function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = [];
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]; // storing cell at each iteration and checking items above it
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break // breaks if can't accept 
                    lastValidCell = moveToCell; // store the cell we last moved to
                }
                if (lastValidCell != null) { // if the tiles moved
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        lastValidCell.tile = cell.tile;
                    }
                    cell.tile = null;
                }
            }
            return promises;
        }))
}
function canMoveUp() {
    return canMove(grid.cellByCol)
}
function canMoveDown() {
    return canMove(grid.cellByCol.map(col => [...col].reverse()))
}
function canMoveLeft() {
    return canMove(grid.cellByRow)
}
function canMoveRight() {
    return canMove(grid.cellByRow.map(row => [...row].reverse()))
}
function canMove(cells) {
    return cells.some(group => {
        // console.log("in can move")
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}








const inputName = document.querySelector("#inlineFormInputGroup")
const inputDiv = document.querySelector(".inputDiv");
const gameDiv = document.querySelector("#game-div")
const gameDivVisible = gameDiv;
gameDiv.remove()
const body = document.querySelector("body")
inputName.addEventListener("keypress", nameEntered)

function nameEntered(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const player = inputName.value;
        inputDiv.style.setProperty("opacity", "0");
        inputDiv.addEventListener('transitionend', () => {
            inputDiv.remove();
            body.append(gameDivVisible)
            const playerName = document.querySelector("#playerName")
            playerName.innerText = `@${player}'s score`
            gameDivVisible.style.setProperty("opacity", "1")
            setupInput();
        }, { once: true });
    }
}
function tryAgain() {
    const gameDiv = document.querySelector("#game-div")
    gameDiv.style.setProperty("opacity", "0.5");
    const gameOver = document.createElement('div')
    gameOver.classList.add('gameOver')
    const tryAgainBtn = document.createElement('button')
    const body = document.querySelector('body')
    tryAgainBtn.classList.add("btn", "btn-dark", "tryAgain")
    tryAgainBtn.innerText = "You Lost, Click here to Try Again?"
    tryAgainBtn.addEventListener("click", () => {
        location.reload();
    })
    gameOver.append(tryAgainBtn)
    gameOver.classList.add("gameOver")

    gameDiv.addEventListener('transitionend', () => {
        // gameDiv.remove();
        body.append(gameOver);

    }
    )
}