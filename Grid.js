const CELL_SIZE = 18;
const GRID_SIZE = 4;
const CELL_GAP = 2;

let score = 0;
let highScore = JSON.parse(localStorage.getItem('highScore'))
highScore = highScore || score;


const scoreBoard = document.querySelector("#score");
const hScoreBoard = document.querySelector("#highscore")
hScoreBoard.innerText=highScore;
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
    get cells(){
        return this.#cells;
    }
    get cellByRow(){
        return this.#cells.reduce((cellGrid,cell)=>{
            cellGrid[cell.y]= cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid;
        },[])

    }
    get cellByCol(){
        return this.#cells.reduce((cellGrid,cell)=>{
            cellGrid[cell.x]= cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid;
        },[])

    }
    // returns an array consisting all the empty cell objs(with their respective position)
    get #emptyCells(){
        return this.#cells.filter( cell => cell.tile == null)
    }
    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        if(this.#emptyCells[randomIndex]){
            return this.#emptyCells[randomIndex]
        }

    }
}
// Cell consists cell positon and the cellElement 
class Cell{
    #cellElement
    #x
    #y
    #tile
    #mergeTile
    constructor(cellElement , x, y){
        // col position
        this.#x =x;
        // row position
        this.#y=y;
        this.#cellElement = cellElement;
    }
    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }
    get mergeTile(){
        return this.#mergeTile;
    }
    set mergeTile(value){
        this.#mergeTile = value;
        if(value == null) return
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }
    
    set tile(value){
        this.#tile = value;
        if(value==null) return ;
        this.#tile.x=this.#x;
        this.#tile.y= this.#y;

    }
    get tile(){
        return this.#tile
    }
    canAccept(tile){
        return this.tile == null || (this.mergeTile == null && this.tile.value === tile.value)
    }
    mergeTiles(){
        if(this.tile == null || this.mergeTile == null) return
        this.tile.value += this.mergeTile.value;
        score+= this.tile.value;
        setScore(score);
        this.mergeTile.remove()
        this.mergeTile=null;
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
function setScore(score){
    if(highScore<score){
        setHighscore(score)
    }
    scoreBoard.innerText= score;
}
function setHighscore(score){
    hScoreBoard.innerText=score;
    highScore = score;
    localStorage.setItem('highScore', JSON.stringify(highScore))
}