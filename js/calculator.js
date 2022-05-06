const lastDisplay = document.querySelector('#display #last');
const currentDisplay = document.querySelector('#display #current');
const characterButtons = document.querySelectorAll('button[data-character]');
const operatorButtons = document.querySelectorAll('button[data-operator]');
const clearButton = document.querySelector('#clear');
const deleteButton = document.querySelector('#delete');
const percentButton = document.querySelector('#percent');
const plusMinusButton = document.querySelector('#plus-minus');
const equalsButton = document.querySelector('#operate');
const operations = [{
	operator: '+',
	func: (a, b) => a + b
}, {
	operator: '-',
	func: (a, b) => a - b
}, {
	operator: '×',
	func: (a, b) => a * b
}, {
	operator: '÷',
	func: (a, b) => a / b
}];
const maxLength = 12;
const operands = ['0', ''];
let func = null;

function inputCharacter(e) {
	const i = func ? 1 : 0;
	const character = e.target.dataset.character;
	const lengthExceeded = operands[i].length >= maxLength;
	const decimalPointAllowed = !operands[i].match(/\.|e/g);
	if (lengthExceeded || (character === '.' && !decimalPointAllowed)) return;
	if (operands[i] == 0) operands[i] = '';
	operands[i] += character;
	updateDisplay()
}

function inputOperator(e) {
	if (operands[1]) operate();
	const operator = e.target.dataset.operator;
	func = operations.find(key => key.operator === operator).func;
	updateDisplay()
}

function getCalculation() {
	const operator = func ? ` ${operations.find(key => key.func === func).operator} ` : '';
	const value = operands.map(operand => addCommas(operand)).join(operator);
	return value.trimEnd();
}

function round(num, digits = maxLength) {
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
	const [a, b] = operands;
	if (func && a && b && b !== '.') {
		const result = round(func(+a, +b));
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
	operands[0] = /(\-*Infinity)|NaN/.test(result) ? '0' : result;
	operands[1] = '';
}

function updateDisplay() {
	currentDisplay.textContent = getCalculation();
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
	let strSlice;
	if (func && operands[1]) {
		strSlice = operands[1].slice(0, -1);
		operands[1] = strSlice !== '-' ? strSlice : '';
	} else if (func) {
		func = null;
	} else {
		strSlice = operands[0].slice(0, -1);
		operands[0] = strSlice && strSlice !== '-' ? strSlice : '0';
	}
	updateDisplay()
}

function getPercent() {
	const i = func ? 1 : 0;
	if (operands[i] == 0) return;
	operands[i] = round(operands[i] / 100);
	updateDisplay()
}

function togglePlusMinus() {
	const i = func ? 1 : 0;
	if (operands[i] == 0) return;
	operands[i] = operands[i].includes('-') ? operands[i].slice(1) : `-${operands[i]}`;
	updateDisplay()
}

function checkKey(e) {
	e.preventDefault();
	if (+e.key) {
		document.querySelector(`.button[data-character="${e.key}"]`).click();
	} else {
		button = document.querySelector(`.button[data-key="${e.key}"]`)
		if (button) {
			button.click();
		}
	}
}

characterButtons.forEach(button => button.addEventListener('click', inputCharacter));
operatorButtons.forEach(button => button.addEventListener('click', inputOperator));
clearButton.addEventListener('click', clearData);
deleteButton.addEventListener('click', deleteCharacter);
percentButton.addEventListener('click', getPercent);
plusMinusButton.addEventListener('click', togglePlusMinus);
equalsButton.addEventListener('click', operate);
window.addEventListener('keydown', checkKey);
