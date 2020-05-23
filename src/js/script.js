const keyboard = document.getElementById('keyboard');
const result = document.getElementById('result');
const operators = ["+", "-", "÷", "×"];
let counter = 0;

function checkDigit(digit) {
	const resultSize = result.textContent.length;
	const lastDigit = result.textContent.substring(resultSize - 1, resultSize);
	let dotStatus = true;

	if (digit === ".") {
		counter = 0;
		let position;
		for (let i = 0; i < operators.length; i++) {
			for (let j = 1; j < resultSize; j++) {
				if (result.textContent.charAt(j) === operators[i]) {
					counter++;
					position = j;
				}
			}
		}

		if (counter === 0) {
			for (let i = 0; i < resultSize; i++) {
				if (result.textContent.charAt(i) === ".") {
					dotStatus = false;
				}
			}
		} else {
			for (let i = position + 1; i < resultSize; i++) {
				if (result.textContent.charAt(i) === ".") {
					dotStatus = false;
				}
			}
		}

		if (resultSize === 0) {
			result.innerText = `0.`;
		} else if (dotStatus) {
			counter = 0;

			operators.forEach(operator => {
				if (lastDigit === operator) {
					counter++;
				}
			});

			if (counter === 0) {
				result.innerText += `.`;
			} else {
				result.innerText += `0.`;
			}
		}
	}

	operators.forEach(operator => {
		if (digit === operator && lastDigit !== ".") {
			if (resultSize === 0) {
				if (digit === operators[0] || digit === operators[1]) {
					result.innerText += digit;
				}
			} else {
				counter = 0;
				operators.forEach(operator => {
					if (lastDigit === operator) {
						counter++;
					}
				});

				if (counter === 0) {
					for (let i = 0; i < operators.length; i++) {
						for (let j = 1; j < resultSize; j++) {
							if (result.textContent.charAt(j) === operators[i]) {
								calc();
							}
						}
					}

					result.innerText += digit;
				} else {
					if (resultSize === 1) {
						if (digit === operators[0] || digit === operators[1]) {
							clean("error");
							result.innerText += digit;
						}
					} else {
						clean("error");
						result.innerText += digit;
					}
				}
			}
		}
	});
}

function show(digit, check) {
	const resultSize = result.textContent.length;

	if (result.textContent === "Impossivel") {
		clean("all");
	}

	if (resultSize <= 10) {
		if (check) {
			checkDigit(digit);
		} else {
			result.innerText += digit;
		}
	}
}

function clean(section) {
	if (result.textContent.length > 0) {
		if (section === "all") {
			result.innerText = "";
		} else if (section === "error") {
			if (result.textContent === "Impossivel") {
				clean("all");
			} else {
				result.innerText = result.textContent.substring(0, result.textContent.length - 1);
			}
		}
	}
}

function calc() {
	const resultSize = result.textContent.length;

	let n1;
	let op;
	let n2;
	let r;

	for (let i = 0; i < operators.length; i++) {
		for (let j = 1; j < resultSize; j++) {
			if (result.textContent.charAt(j) === operators[i]) {
				n1 = Number(result.textContent.substring(0, j));
				op = operators[i];
				n2 = Number(result.textContent.substring(j + 1, resultSize));

				switch (op) {
					case "+":
						r = n1 + n2;
						break;

					case "-":
						r = n1 - n2;
						break;

					case "÷":
						r = n1 / n2;
						break;

					case "×":
						r = n1 * n2;
						break;

					default:
						break;
				}

				if (r.toString().length > 5) {
					for (let i = 0; i < r.toString().length; i++) {
						if (r.toString().charAt(i) === ".") {
							r = r.toString().substring(0, i + 4);
						}
					}
				}

				clean("all");

				const rString = r.toString().toLowerCase();

				if (rString === "infinity" || rString === "nan" || rString === "-nan" || rString === "-infinity") {
					r = "Impossivel";
				}

				result.innerText = `${r}`;
			}
		}
	}
}

keyboard.addEventListener("click", (event) => {
	const element = event.target;
	const job = element.dataset.job;'job'

	switch (job) {
		case "clear":
			clean("all");
			break;

		case "clearError":
			clean("error");
			break;

		case "number":
			show(element.textContent, false);
			break;

		case "operator":
			show(element.textContent, true);
			break;

		case "equal":
			for (let i = 0; i < operators.length; i++) {
				for (let j = 1; j < result.textContent.length; j++) {
					if (result.textContent.charAt(j) === operators[i]) {
						calc();
					}
				}
			}
			break;

		case "dot":
			show(".", true);
			break;

		default:
			break;
	}
});

document.addEventListener("keydown", (event) => {
	const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	const dot = [".", ","];
	const opsArray = ["+", "-", "*", "/"];
	const keyValue = event.key;

	numbers.forEach(number => {
		if (keyValue === number) {
			show(keyValue, false);
		}
	});

	dot.forEach(d => {
		if (keyValue === d) {
			show(".", true);
		}
	});

	opsArray.forEach(operator => {
		if (keyValue === operator) {
			switch (operator) {
				case "+":
					show("+", true);
					break;

				case "-":
					show("-", true);
					break;

				case "*":
					show("×", true);
					break;

				case "/":
					show("÷", true);
					break;

				default:
					break;
			}
		}
	});

	if (keyValue.toLowerCase() === "enter") {
		for (let i = 0; i < operators.length; i++) {
			for (let j = 1; j < result.textContent.length; j++) {
				if (result.textContent.charAt(j) === operators[i]) {
					calc();
				}
			}
		}
	}

	if (keyValue.toLowerCase() === "backspace") {
		clean("error");
	}

	if (keyValue.toLowerCase() === "delete") {
		clean("all");
	}
});