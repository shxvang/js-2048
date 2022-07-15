export default class Tile{
    #tileElement
    #value
    #x
    #y
    constructor(tileConatiner, value = Math.random() > 0.5 ? 2 : 4){
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile")
        tileConatiner.append(this.#tileElement)
        this.value=value;
    }
    set value(v){
        this.#value= v;
        const power = Math.log2(v);
        this.#tileElement.innerText= v ;
        const backgroundLightness = 100  - power*9;
        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
        this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`)
    }
    get value(){
        return this.#value;
    }
    set x(value){
        this.#x= value;
        this.#tileElement.style.setProperty("--x",value)
    }
    set y(value){
        this.#y = value;
        this.#tileElement.style.setProperty("--y",value)
    }
    remove(){
        this.#tileElement.remove();
    }
    waitForTransiton(){
        return  new Promise(res =>
            this.#tileElement.addEventListener("transitionend",res,{once : true}))
    }
}