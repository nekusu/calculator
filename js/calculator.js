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
	func: multiply
}, {
	operator: '÷',
	func: divide
}];
const maxLength = 12;
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
	const lengthExceeded = operands[i].replace('-', '').length >= maxLength;
	const decimalPointAllowed = !operands[i].includes('.') && !operands[i].includes('e');
	if (!lengthExceeded && (decimalPointAllowed || num !== '.')) {
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
	const value = addCommas(operands[0]) + operator + addCommas(operands[1]);
	return value.trimRight();
}

function round(num, digits) {
	num = +num.toFixed(digits);
	return num.toString();
}

function addCommas(num) {
	const string = num.toString().split('.');
	string[0] = string[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return string.join('.');
}

function restartTransition(el) {
	el.style.transitionDuration = '0s';
	el.classList.add('hidden');
	el.getBoundingClientRect();
	el.style.transitionDuration = '';
	el.classList.remove('hidden');
}

function operate() {
	const [a, b] = [operands[0], operands[1]];
	if (func && a && b) {
		const result = round(func(+a, +b), maxLength / 1.25);
		showResult(result);
	}
}

function showResult(result) {
	lastDisplay.removeEventListener('transitionend', clearLastDisplay);
	restartTransition(lastDisplay);
	lastDisplay.textContent = getCalculation();
	restartTransition(currentDisplay);
	currentDisplay.textContent = `= ${addCommas(result)}`;
	func = null;
	operands[0] = (['Infinity', 'NaN'].includes(result)) ? '0' : result;
	operands[1] = '';
}

function clearLastDisplay() {
	lastDisplay.textContent = '';
}

function clearData() {
	func = null;
	operands[0] = '0';
	operands[1] = '';
	lastDisplay.classList.add('hidden');
	lastDisplay.addEventListener('transitionend', clearLastDisplay, { once: true });
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

function getPercent() {
	if (operands[1] != 0) {
		operands[1] = round(operands[1] / 100, maxLength / 1.25);
	} else if (!func && operands[0] != 0) {
		operands[0] = round(operands[0] / 100, maxLength / 1.25);
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

function checkKey(e) {
	e.preventDefault();
	if (+e.key) {
		document.querySelector(`.button[data-number="${e.key}"]`).click();
	} else {
		button = document.querySelector(`.button[data-key="${e.key}"]`)
		if (button) {
			button.click();
		}
	}
}

numberButtons.forEach(button => button.addEventListener('click', inputNumber));
operatorButtons.forEach(button => button.addEventListener('click', inputOperator));
clearButton.addEventListener('click', clearData);
deleteButton.addEventListener('click', deleteCharacter);
percentButton.addEventListener('click', getPercent);
plusMinusButton.addEventListener('click', togglePlusMinus);
equalsButton.addEventListener('click', operate);
window.addEventListener('keydown', checkKey);
