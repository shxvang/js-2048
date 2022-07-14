const CELL_SIZE = 20;
const GRID_SIZE = 4;
const CELL_GAP = 2;

export default class Grid {
    #cells
    constructor(gridElement) {
        gridElement.style.setProperty("--cell-size",`${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--grid-size",GRID_SIZE);
        gridElement.style.setProperty("--cell-gap",`${CELL_GAP}vmin`);
        // below line maps a new array of Cell class's  obj to cells variable 
        this.#cells = createCellElements(gridElement).map((cellELement,index) =>{
            return new Cell(cellELement,index%GRID_SIZE,Math.floor(index/GRID_SIZE))
        });
    }
    // returns an array consisting all the empty cell objs(with their respective position)
    get #emptyCells(){
        return this.#cells.filter( cell => cell.tile == null)
    }
    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]

    }
}
// Cell consists cell positon and the cellElement 
class Cell{
    #cellElement
    #x
    #y
    #tile
    constructor(cellElement , x, y){
        // col position
        this.#x =x;
        // row position
        this.#y=y;
        this.#cellElement = cellElement;
    }
    // set tile(){

    // }
    get tile(){
        return this.#tile
    }
}
// appends cells in game-board and returns cells array consisting each cellELement
function createCellElements(gridElement){
    const cells = [];
    for(let i=0;i<GRID_SIZE *GRID_SIZE;i++){
       const cell =  document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
