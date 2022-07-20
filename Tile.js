//tile class
export default class Tile {
    //tile class data members
    #tileElement
    #value
    #x
    #y
    //tile class constructor
    constructor(tileConatiner, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile")
        tileConatiner.append(this.#tileElement)
        this.value = value;
    }
    // setters and getters of data members
    set value(v) {
        this.#value = v;
        const power = Math.log2(v);
        this.#tileElement.innerText = v;
        //logic for calculating tile background color
        const backgroundLightness = 100 - power * 9;
        //setting properties
        this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)
        this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`)
    }
    get value() {
        return this.#value;
    }
    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value)
    }
    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value)
    }
    remove() {
        this.#tileElement.remove();
    }
    // this returns a promise once once animation/transtionend 
    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(
                animation ? "animationend" : "transitionend",
                resolve,
                {
                    once: true,
                }
            )
        })
    }
}