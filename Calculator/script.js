let expressionDisplay = document.getElementById("expression");
let resultDisplay = document.getElementById("result");
let expression = "";
let lastAnswer = 0;
let justCalculated = false; // flag to check if last action was calculation

function appendValue(value) {
  if (justCalculated) {
    // If last was calculation and next is an operator, continue calculation
    if (/[+\-*/%]/.test(value)) {
      expression = lastAnswer + value;
    } else {
      // If it's a number or something else, start new calculation
      expression = value;
    }
    justCalculated = false;
  } else {
    expression += value;
  }
  expressionDisplay.textContent = expression;
}

function clearAll() {
  expression = "";
  expressionDisplay.textContent = "";
  resultDisplay.textContent = "0";
  justCalculated = false;
}

function deleteLast() {
  expression = expression.slice(0, -1);
  expressionDisplay.textContent = expression;
}

function calculate() {
  try {
    let result = eval(expression);
    resultDisplay.textContent = result;
    lastAnswer = result;
    justCalculated = true; // mark that calculation just happened
  } catch {
    resultDisplay.textContent = "Error";
    justCalculated = false;
  }
}

function useAns() {
  expression += lastAnswer;
  expressionDisplay.textContent = expression;
}
