const addIngredientBtn = document.getElementById("add__ingredient");
let containerIngredients = document.getElementById('container__ingredients');


const addInput = () => {
    let divIngredient = document.createElement("div")
    divIngredient.className = "each__ingredient"
    containerIngredients.appendChild(divIngredient);
    let inputIngredient = document.createElement("input");
    inputIngredient.className = "inputIngredient";
    inputIngredient.type = "text";
    inputIngredient.name = "ingredient";
    inputIngredient.placeholder ="insert quantity and name of the ingredient"
    divIngredient.appendChild(inputIngredient);
    let removeIngredientBtn = document.createElement("button")
    removeIngredientBtn.innerHTML = "<i class='fa fa-trash'></i>"
    removeIngredientBtn.className = "btn__remove"
    divIngredient.appendChild(removeIngredientBtn)
    let insertBreak = document.createElement("br");
    divIngredient.appendChild(insertBreak);
    inputIngredient.after(inputIngredient)
    const removeInput = () => {
        divIngredient.removeChild(inputIngredient);
        divIngredient.removeChild(removeIngredientBtn);
        divIngredient.removeChild(insertBreak);
    }
     removeIngredientBtn.addEventListener("click", removeInput);
}

addIngredientBtn.addEventListener("click", addInput);



