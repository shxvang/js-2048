import Tile from "./Tile.js";
import Grid from "/Grid.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);

//initial two tiles creation 
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();
// function to setInput using an Event Listener 
function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp": if (!canMoveUp) {
            setupInput()
            return
        }
            await moveUp();
            break;
        case "ArrowDown": if (!canMoveDown) {
            setupInput()
            return
        }
            await moveDown();
            break;
        case "ArrowLeft": if (!canMoveLeft) {
            setupInput()
            return
        }
            await moveLeft();
            break;
        case "ArrowRight": if (!canMoveRight) {
            setupInput()
            return
        }
            await moveRight();
            break;
        default: setupInput();
            return;
    }
    grid.cells.forEach(cell => cell.mergeTiles())
    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;
    setupInput();
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
                    promises.push(cell.tile.waitForTransiton())
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
function canMoveUp(){
    return canMove(grid.cellByCol)
}
function canMoveDown(){
    return canMove(grid.cellByCol.map(col => [...col].reverse()))
}
function canMoveLeft(){
    return canMove(grid.cellByRow)
}
function canMoveRight(){
    return canMove(grid.cellByRow.map(row => [...row].reverse()))
}
function canMove(cells){
    return cells.some(group=>{
        return group.some((cell,index)=>{
            if(index==0) return false
            if(cell.tile ==  null ) return false
            const moveToCell = group[index-1]
            return moveToCell.canAccept(cell.tile)

        })
    })

}