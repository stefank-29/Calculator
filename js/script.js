
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
let result = 0;

const display = document.querySelector("#label");
display.textContent = displayValue;
const equals = document.querySelector("#equals");
equals.addEventListener('click', calculate);

const numbers = Array.from(document.querySelectorAll(".number"));
numbers.forEach(number => number.addEventListener('click', insertNumber));

const operators = Array.from(document.querySelectorAll(".operator"));
operators.forEach(operator => operator.addEventListener('click', storeOperator))



let insert = true;
let clean = true; // in the begining 
let lastOperator;
let calcEnabled = false;

function insertNumber(event){
    if(insert == true){    // insert numbers to display enable
        let number = parseFloat(event.target.textContent);
        displayValue *= 10;
        displayValue += number;
        display.textContent = displayValue;
    }
}

function storeOperator(event){
    insert = true;
    lastOperator = operator;
    operator = event.target.textContent;
    if((lastOperator == '+' || lastOperator == '-') && (operator == 'x' || operator == '/')){

    }else{
        if(calcEnabled == true){
            rightOperand = parseFloat(displayValue);
            result = operate(leftOperand, rightOperand, lastOperator);
            display.textContent = result;
            leftOperand = result;
            
        }
    }
    calcEnabled = true; 
    if(clean == true){  // kad mi je sve obrisano prvi put u levi operand stavim dispVal inace samo displayValue stavim na 0
        leftOperand = parseFloat(displayValue);
        displayValue = 0;
        clean = false;
       
    }else{
        displayValue = 0; 
        
    }
    
 ///// dodati klasu za hajlajtovanje dugmeta
}

function calculate(event){
    rightOperand = parseFloat(displayValue);
    result = operate(leftOperand, rightOperand, operator);
    display.textContent = result;
    leftOperand = result;
    calcEnabled = false;
    insert = false;
    //clean = false;
}
