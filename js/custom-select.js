// Add customized options
// Show options when input is on focus
// Hide options when it's not on focus
// Hide options on click
// Show options on change
// Add your custom options

let showSelectBlock = (ele) => {
    ele.style.display = "block";
}

let hideSelectBlock = (ele) => {
    ele.style.display = "none";
}

let fetchedOptions = (identifier, value) => {
    let options = [];
    let check = false;
    if(value === undefined){
        value = "";
    }
    let gigiInput = document.querySelector("[gigi-input=\"" + identifier + "\"]");
    let gigiSelect = document.querySelector("[gigi-select=\"" + identifier + "\"]");
    let gigiOptions = document.querySelectorAll("[gigi-select=\"" + identifier + "\"] [gigi-option]");
    gigiInput.removeAttribute("gigi-validate");
    hideSelectBlock(gigiSelect);
    for(let i = 0; i < gigiOptions.length; i++){
        gigiOptions[i].style.display = "none";
        gigiOptions[i].removeAttribute("gigi-option-active");
        gigiOptions[i].removeAttribute("gigi-selected");
        let option = gigiOptions[i].getAttribute("gigi-option");
        options.push(option);
        if(i === gigiOptions.length - 1){
            check = true;
        }
    }
    let loadingData = setInterval(() => {
        if(check){
            let filteredOptions = options.filter(element => {
                if (element.toLowerCase().includes(value.toLowerCase())) {
                    if(element.toLowerCase() === value.toLowerCase()){
                        gigiInput.setAttribute("gigi-validate", "");
                        let ele = document.querySelector("[gigi-select=\"" + identifier + "\"] [gigi-option=\"" + element + "\"]");
                        ele.setAttribute("gigi-option-active", "");
                    }
                  return true;
                }
            });
            if(filteredOptions.length > 0){
                showSelectBlock(gigiSelect);
                for(let i = 0; i < filteredOptions.length; i++){
                    document.querySelector("[gigi-option=\"" + filteredOptions[i] + "\"]").style.display = "block";
                }
            }
            else {
                gigiInput.removeAttribute("gigi-validate");
                hideSelectBlock(gigiSelect);
            }
            clearInterval(loadingData);
            options.forEach((item, index) => {
                let ele = document.querySelector("[gigi-select=\"" + identifier + "\"] [gigi-option=\"" + item + "\"]");
                ele.addEventListener("click", ((j) => {
                    return function() {
                        if(item !== null){
                            gigiInput.value = item;
                            gigiInput.setAttribute("gigi-validate", "");
                            ele.setAttribute("gigi-option-active", "");
                        }
                    }
                })(index));
            });
            return options;
        }
    }, 200);
}

let customSelect = () => {
    let gigiInputs = document.querySelectorAll("[gigi-input]");
    for(let i = 0; i < gigiInputs.length; i++){
        // On focus
        gigiInputs[i].addEventListener("focus", ((j) => {
            return function(){
                if(this.hasAttribute("gigi-init-suggestion")){
                    let gigiInputName = gigiInputs[j].getAttribute("gigi-input");
                    let initialValue = gigiInputs[j].value;
                    if((initialValue !== undefined) && (initialValue !== null)){
                        fetchedOptions(gigiInputName, initialValue);
                    }
                    else {
                        fetchedOptions(gigiInputName);
                    }
                }
            }
        })(i));

        // On Key Up
        gigiInputs[i].addEventListener("keyup", ((j) => {
            return function(){
                let gigiInputName = gigiInputs[j].getAttribute("gigi-input");
                fetchedOptions(gigiInputName, gigiInputs[j].value);
            }
        })(i));

        // On Blur
        gigiInputs[i].addEventListener("blur", ((j) => {
            return function(){
                let gigiInputName = gigiInputs[j].getAttribute("gigi-input");
                let gigiSelect = document.querySelector("[gigi-select=\"" + gigiInputName + "\"]");
                setTimeout(() => {
                    hideSelectBlock(gigiSelect);
                }, 200);
            }
        })(i));
    }
}

let checks = () => {
    let gigiSelects = document.querySelectorAll("[gigi-select]");
    gigiSelects.forEach((ele) => {
        let identifier = ele.getAttribute("gigi-select");
        let gigiOptions = document.querySelectorAll("[gigi-select=\"" + identifier + "\"] [gigi-option]");
        gigiOptions.forEach((ele) => {
            if(ele.getAttribute("gigi-selected") == "true"){
                let initialValue = ele.getAttribute("gigi-option");
                if(initialValue !== null){
                    let gigiInput = document.querySelector("[gigi-input=\"" + identifier + "\"]");
                    gigiInput.value = initialValue;
                    gigiInput.setAttribute("gigi-validate", "");
                    ele.setAttribute("gigi-option-active", "");
                }
            }
        });
    });
}

let validateInput = (input) => {
    let gigiInput = document.querySelector("[gigi-input=\"" + input + "\"]");
    if(gigiInput.hasAttribute("gigi-validate")){
        return true;
    }
    else {
        return false;
    }
}

let gigiCustomSelect = {
    run: () => {
        customSelect();
        checks();
    },
    validate: (input) => {
        return validateInput(input);
    }
}