import fruits from "../../src/data/fruits";

export function fruitCreate(name :string, price :number) :void{
    const id = fruits.length +1;
    fruits.push({
        id,
        name,
        price
    })
    return
}