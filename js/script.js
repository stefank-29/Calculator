
function add(num1, num2){
    return num1 + num2;
}
function sub(num1, num2){
    return num1 - num2;
}
function mul(num1, num2){
    return num1 * num2;
}
function div(num1, num2){
    return num1 / num2;
}


//console.log(mul(3,5));
//console.log(div(15, 4));
function operate(num1, num2, operator){
   
    switch(operator){
        case '+':
            return add(num1, num2);
            break;
        case '-':
            return sub(num1, num2);
            break;
        case 'x':
            return mul(num1, num2);
            break;
        case '/':
            return div(num1, num2);
            break;
    }
}

//console.log(operate(15, 14, '+'));

let displayValue = 0;
let operator;
let leftOperand;
let rightOperand;
let currOperator;
let result = 0;
let sum = 0;
let severalOperations = false;
let nextNumber = false;

const display = document.querySelector("#label");
display.textContent = displayValue;
const equals = document.querySelector("#equals");
equals.addEventListener('click', calculate);

const numbers = Array.from(document.querySelectorAll(".number"));
numbers.forEach(number => number.addEventListener('click', insertNumber));

const operators = Array.from(document.querySelectorAll(".operator"));
operators.forEach(operator => operator.addEventListener('click', storeOperator))
//operators.forEach(operator => operator.addEventListener('click', insertOperator))
// clear
const clear = document.querySelector("#clear");
clear.addEventListener('click', clearCalculator);
const clearEntry = document.querySelector("#clearEntry");
clearEntry.addEventListener('click', clearBufer);
// backspace
const backspace = document.querySelector("#backspace");
backspace.addEventListener('click', undo);


let insert = true;
let clean = true; // in the begining 
let lastOperator;
let calcEnabled = false; // calculation on multiple operators clicked
let calcAfterFirst = false;
let displayReset = false;
let displayText;
let buferEdit = true;
let dotEnabled = true;
let afterDot = false;
let afterDotNumber = false;
let enableBackspace = true;

function afterDotFirst(input){
    let number;
    if(input == undefined){
        number = parseFloat(event.target.textContent);
    }else{
        number = parseFloat(input);
    }
   
    if(number == 0){
        display.textContent += '0';
    }else{
        displayValue *= 10;
        displayValue += number;
        displayValue /= 10;
        display.textContent = displayValue;
    }
    
    if(calcAfterFirst){   // ukljucuje se racunanje kad se unese broj(samo se prvi put preskoci jer nema desnog opreatora)
        calcEnabled = true; 
    }
    nextNumber = false; 
    buferEdit = true; 
    afterDot = false;  
    afterDotNumber = true;
}
function afterDotInsert(input){
    if(input == undefined){
        display.textContent += event.target.textContent;
    }
    else{
        display.textContent += input;
    }
    displayValue = parseFloat(display.textContent);
}

function insertNumber(event, input){
    if(insert){ // insert numbers to display enable
        if(display.textContent.length > 12 && !displayReset){
            return;
        }   
        if(displayReset){   // ako treba da resetujem bafer
            displayValue = 0;
            displayReset = false;
        }
        
        let dot;
        if(input == undefined){
            dot = event.target.textContent;
        }else{
            dot = input;
        }
        
        if((dot == '.') && dotEnabled){
            displayText = display.textContent;
            if(displayText.includes(".")){
                return;
            }
            displayText += '.';
            display.textContent = displayText;
            dotEnabled = false;
            afterDot = true;
            return;
        }else if(dot == '.'){
            return;
        }
        if(afterDot){
            afterDotFirst(input);  // prvi broj posle tacke
            return;
        }
        if(afterDotNumber){
            afterDotInsert(input);  // ostali brojevi posle tacke
            return;
        }
        let number;
        if(input != undefined){
            number = parseFloat(input);
        }else{
            number = parseFloat(event.target.textContent);
        }
        displayValue *= 10;
        displayValue += number;
        display.textContent = displayValue;
        if(calcAfterFirst){   // ukljucuje se racunanje kad se unese broj(samo se prvi put preskoci jer nema desnog opreatora)
            calcEnabled = true; 
        }
        nextNumber = false; 
        buferEdit = true;  // mogu da prisem bafer
        dotEnabled = true;  
        enableBackspace = true;
    }
    
}

function storeOperator(event, input){

    insert = true;
    calcAfterFirst = true;
    buferEdit = true; 
    afterDot = false;  
    afterDotNumber = false;
    dotEnabled = false;
    enableBackspace = false;

    if(!severalOperations){
        lastOperator = operator;
    }
    if(input != undefined){
        operator = input;
    }else{
        if(event.target.textContent == '×'){
            operator = 'x';
        }else if(event.target.textContent == '÷'){
            operator = '/';
        }else{
            operator = event.target.textContent;
        }
    }
    if((lastOperator == '+' || lastOperator == '-') && (operator == 'x' || operator == '/')){
        
        if(calcEnabled){    
            if(!nextNumber){
                severalOperations = true;
                if(sum == 0){   // kad pocnem mnozenje ili deljenje posle + ili -
                    sum = parseFloat(displayValue);
                    currOperator = operator;
                }else{                  // racunam  tekucu sumu mnozenja ili deljenja i ispisujem
                    rightOperand = parseFloat(displayValue);
                    if(rightOperand == 0 && currOperator == '/'){
                        divideZero();
                        return;
                    }
                    sum = operate(sum, rightOperand, currOperator);
                    sum = Math.round((sum + Number.EPSILON) * 10000000) / 10000000;
                    display.textContent = sum;
                    currOperator = operator;
                }
            }
            nextNumber = true;
            buferEdit = false;
        }
        
    }else{   // dodati jos jednom desni operand u sumu
        if(calcEnabled){
            if(!nextNumber){
                if(sum !==  0){     // nakon mnozenja ili deljenja kad saberem(oduzmem) tu sumu
                    rightOperand = parseFloat(displayValue);
                    if(rightOperand == 0 && currOperator == '/'){
                        divideZero();
                        return;
                    }
                    sum = operate(sum, rightOperand, currOperator);
                    result = operate(leftOperand, sum, lastOperator);  // od sacuvanog levog operanda oduzmem ili dodam proizvod(kolicnik)
                    result = Math.round((result + Number.EPSILON) * 10000000) / 10000000;
                    display.textContent = result;
                    leftOperand = result; 
                    severalOperations = false;
                    currOperator = undefined;
                    sum = 0;  
                    nextNumber = true;
                }else{
                
                        rightOperand = parseFloat(displayValue);     // regularni ispis
                        if(rightOperand == 0 && lastOperator == '/'){
                            clearCalculator();
                            display.textContent = "Error";
                            return;
                        }
                        result = operate(leftOperand, rightOperand, lastOperator);  // izracunam rezultat za prethodni operator 
                        result = Math.round((result + Number.EPSILON) * 10000000) / 10000000;
                        display.textContent = result;
                        leftOperand = result;  
                    
                
                }

            }  // ako promenim operator sa * ili / na + ili -
            if((currOperator == 'x' || currOperator == '/') && (operator == '+' || operator == '-')){
                rightOperand = parseFloat(displayValue);
                if(rightOperand == 0 && operator == '/'){  // mozda visak
                    divideZero();
                    return;
                }
                result = operate(leftOperand, rightOperand, operator);
                result = Math.round((result + Number.EPSILON) * 10000000) / 10000000;
                display.textContent = result;
                leftOperand = result;    
                currOperator = undefined;   // resetujem mod veceg prioriteta
                sum = 0;
                severalOperations = false;

            }
            buferEdit = false;
            nextNumber = true;
        }
    }
    //calcEnabled = true; 
    if(clean){  // kad mi je sve obrisano prvi put u levi operand stavim dispVal inace samo displayValue stavim na 0
        leftOperand = parseFloat(displayValue);
        //displayValue = 0;
        displayReset = true;
        clean = false;
       
    }else{
        //displayValue = 0; 
        displayReset = true;
        
    }
}

function calculate(event){  
    buferEdit = false;
    dotEnabled = false;
    afterDot = false;  
    afterDotNumber = false;
    enableBackspace = false;
    if(leftOperand == undefined && rightOperand == undefined){
        return;
    }
    /*if(rightOperand == undefined){
         result = operate(leftOperand, leftOperand, operator);
    }else */
    
    if(sum != 0){
        rightOperand = parseFloat(displayValue);
        sum = operate(sum, rightOperand, currOperator);
        result = operate(leftOperand, sum, lastOperator);
        sum = 0;
        severalOperations = false;

    }else{
        rightOperand = parseFloat(displayValue);
        result = operate(leftOperand, rightOperand, operator);
    }
    if((rightOperand == 0)&& (currOperator == '/' || operator == '/')){     // deljenje sa 0 pa =
        divideZero();
        return;
    }
    result = Math.round((result + Number.EPSILON) * 10000000) / 10000000;
    display.textContent = result;
    leftOperand = result;
    calcEnabled = false; // ako posle = kliknem neki operator nista se ne desava(ne racuna se izraz jos jednom)
    insert = false;
    
    //clean = false;
}

function clearCalculator(event){
    displayValue = 0;
    result = 0;
    sum = 0;
    leftOperand = undefined;
    rightOperand = undefined;
    lastOperator = undefined;
    operator = undefined;
    currOperator = undefined;
    severalOperations = false;
    nextNumber = false;
    insert = true;
    clean = true; // in the begining 
    lastOperator;
    calcEnabled = false; // calculation on multiple operators clicked
    calcAfterFirst = false;
    displayReset = false;
    display.textContent = result;
    dotEnabled = true;
    afterDot = false;
    afterDotNumber = false;
}

function clearBufer(event){
    if(buferEdit){
        displayValue = 0;
        display.textContent = displayValue;
    }
    dotEnabled = true;
    afterDot = false;
    afterDotNumber = false;

}

function divideZero(){
    clearCalculator();
    display.textContent = "Error";
    return;
}
let bufer;
let baferNum;

function undo(){
    bufer = display.textContent;
    if (!enableBackspace){
        return;
    }
    if(!bufer.includes(".") && dotEnabled){  // kada nije dozvoljena tacka nije ni brisanje(posle = ili nekog operatora)
        buferNum = parseFloat(bufer);
        buferNum /= 10;
        buferNum = Math.floor(buferNum);
        display.textContent = buferNum;
        displayValue = buferNum;

        return;
    }else {
        if(bufer.slice(-1) == '.'){
            dotEnabled = true;
            afterDot = false;
            afterDotNumber = false;
        }
        bufer = bufer.slice(0, -1);
        buferNum = parseFloat(bufer);
        display.textContent = bufer;
        displayValue = buferNum;
        return;
    }
}


document.addEventListener('keydown', () =>{
    //console.log(event.key);
    switch (event.key) {
        case "Enter":
            calculate();
            break;
        case "Backspace":
            undo();
            break;
        case "*":
            storeOperator(event, 'x');
            break;
        case "/":
            storeOperator(event, '/');
            break;
        case "+":
            storeOperator(event, '+');
            break;
        case "-":
            storeOperator(event, '-');
            break;
        case "c":
            clearCalculator();
            break;
        case ".":
            insertNumber(event, event.key);
            break;
        default:
            if(isFinite(event.key) && event.key != " "){
                insertNumber(event, event.key);
            }
            break;
    }
   
});
