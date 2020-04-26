
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
const clear = document.querySelector("#clear");
clear.addEventListener('click', clearCalculator);
const clearEntry = document.querySelector("#clearEntry");
clearEntry.addEventListener('click', clearBufer);


let insert = true;
let clean = true; // in the begining 
let lastOperator;
let calcEnabled = false; // calculation on multiple operators clicked
let calcAfterFirst = false;
let displayReset = false;
let buferEdit = true;

function insertNumber(event){
    if(insert == true){    // insert numbers to display enable
        if(displayReset){   // ako treba da resetujem bafer
            displayValue = 0;
            displayReset = false;
        }
        let number = parseFloat(event.target.textContent);
        displayValue *= 10;
        displayValue += number;
        display.textContent = displayValue;
        if(calcAfterFirst){   // ukljucuje se racunanje kad se unese broj(samo se prvi put preskoci jer nema desnog opreatora)
            calcEnabled = true; 
        }
        nextNumber = false;
        buferEdit = true;
    }
    
}
/*function insertOperator(event){
    if(insert == true){    // insert numbers to display enable
        displayValue += operator;
        display.textContent = displayValue;
    }
}
*/

function storeOperator(event){
    
    insert = true;
    calcAfterFirst = true;
    buferEdit = true;
    
    if(!severalOperations){
        lastOperator = operator;
    }
    operator = event.target.textContent;
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
    if(clean == true){  // kad mi je sve obrisano prvi put u levi operand stavim dispVal inace samo displayValue stavim na 0
        leftOperand = parseFloat(displayValue);
        //displayValue = 0;
        displayReset = true;
        clean = false;
       
    }else{
        //displayValue = 0; 
        displayReset = true;
        
    }
   
 ///// dodati klasu za hajlajtovanje dugmeta
}

function calculate(event){  
    buferEdit = false;
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
}

function clearBufer(event){
    if(buferEdit){
        displayValue = 0;
        display.textContent = displayValue;
    }

}

function divideZero(){
    clearCalculator();
    display.textContent = "Error";
    return;
}