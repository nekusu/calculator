const lastDisplay = document.querySelector('#display #last');
const currentDisplay = document.querySelector('#display #current');
const numberButtons = document.querySelectorAll('button[data-number]');
const operatorButtons = document.querySelectorAll('button[data-operator]');
const clearButton = document.querySelector('#clear');
const deleteButton = document.querySelector('#delete');
const percentButton = document.querySelector('#percent');
const plusMinusButton = document.querySelector('#plus-minus');
const equalsButton = document.querySelector('#operate');
const operations = [{
	operator: '+',
	func: add
}, {
	operator: '-',
	func: subtract
}, {
	operator: '×',
	altOperator: '*',
	func: multiply
}, {
	operator: '÷',
	altOperator: '/',
	func: divide
}];
const operands = ['0', ''];
let func = null;

function add(a, b) {
	return a + b;
}

function subtract(a, b) {
	return a - b;
}

function multiply(a, b) {
	return a * b;
}

function divide(a, b) {
	return a / b;
}

function inputNumber(e) {
	const num = e.target.dataset.number;
	const i = !func ? 0 : 1;
	if (!operands[i].includes('.') || num !== '.') {
		operands[i] = (operands[i] === '0' && num !== '.') ? num : operands[i] + num;
	}
	currentDisplay.textContent = getCalculation();
}

function inputOperator(e) {
	if (operands[1]) {
		operate();
	}
	const operator = e.target.dataset.operator;
	func = operations.find(key => key.operator === operator).func;
	currentDisplay.textContent = getCalculation();
}

function getCalculation() {
	const operator = func ? ` ${operations.find(key => key.func === func).operator} ` : '';
	const value = operands[0] + operator + operands[1];
	return value.trimRight();
}

function round(num, decimals) {
	return (+num.toPrecision(decimals)).toString();
}

function operate() {
	const [a, b] = [operands[0], operands[1]];
	if (func && a && b) {
		const result = round(func(+a, +b), 7);
		showResult(result);
	}
}

function showResult(result) {
	lastDisplay.textContent = getCalculation();
	currentDisplay.textContent = `= ${result}`;
	func = null;
	operands[0] = (['Infinity', 'NaN'].includes(result)) ? '0' : result;
	operands[1] = '';
}

function clearData() {
	func = null;
	operands[0] = '0';
	operands[1] = '';
	lastDisplay.textContent = '';
	currentDisplay.textContent = '0';
}

function deleteCharacter() {
	if (func && operands[1]) {
		operands[1] = operands[1].slice(0, -1);
	} else if (func) {
		func = null;
	} else {
		operands[0] = operands[0].slice(0, -1) || '0';
	}
	currentDisplay.textContent = getCalculation();
}

function percent() {
	if (operands[1] != 0) {
		operands[1] = round(operands[1] / 100, 7);
	} else if (!func && operands[0] != 0) {
		operands[0] = round(operands[0] / 100, 7);
	}
	currentDisplay.textContent = getCalculation();
}

function togglePlusMinus() {
	if (operands[1] != 0) {
		operands[1] = operands[1].includes('-') ? operands[1].slice(1) : `-${operands[1]}`;
	} else if (!func && operands[0] != 0) {
		operands[0] = operands[0].includes('-') ? operands[0].slice(1) : `-${operands[0]}`;
	}
	currentDisplay.textContent = getCalculation();
}

numberButtons.forEach(button => button.addEventListener('click', inputNumber));
operatorButtons.forEach(button => button.addEventListener('click', inputOperator));
clearButton.addEventListener('click', clearData);
deleteButton.addEventListener('click', deleteCharacter);
percentButton.addEventListener('click', percent);
plusMinusButton.addEventListener('click', togglePlusMinus);
equalsButton.addEventListener('click', operate);
