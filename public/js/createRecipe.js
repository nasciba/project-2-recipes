const addIngredientBtn = document.getElementById("add__ingredient");
let containerIngredients = document.getElementById('container__ingredients');


const addInput = () => {
    let divIngredient = document.createElement("div")
    containerIngredients.appendChild(divIngredient);
    let inputIngredient = document.createElement("input");
    inputIngredient.className = "inputIngredient";
    inputIngredient.type = "text";
    divIngredient.appendChild(inputIngredient);
    let insertBreak = document.createElement("br");
    divIngredient.appendChild(insertBreak);
    let removeIngredientBtn = document.createElement("button")
    removeIngredientBtn.innerText = "Remove"
    removeIngredientBtn.className = "btn__create__recipe"
    divIngredient.appendChild(removeIngredientBtn)
    const removeInput = () => {
        divIngredient.removeChild(inputIngredient);
        divIngredient.removeChild(removeIngredientBtn);
        divIngredient.removeChild(insertBreak);
    }
     removeIngredientBtn.addEventListener("click", removeInput);
}

addIngredientBtn.addEventListener("click", addInput);



