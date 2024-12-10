// Calculator class definition
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        // Initialize references to the DOM elements for displaying operands
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        // Call the clear method to initialize values
        this.clear();
    }

    // Method to reset the calculator
    clear() {
        this.currentOperand = ''; // Clear current operand
        this.previousOperand = ''; // Clear previous operand
        this.operation = undefined; // No operation selected
    }

    // Method to delete the last character from the current operand
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    // Method to append a number to the current operand
    appendNumber(number) {
        // Prevent adding multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    // Method to choose the operation for calculation (+, -, *, ÷)
    chooseOperation(operation) {
        // If there is no current operand, return
        if (this.currentOperand === '') return;
        // If there is already a previous operand, compute the result before changing the operation
        if (this.previousOperand !== '') {
            this.compute();
        }
        // Set the current operation and move the current operand to the previous operand
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = ''; // Clear current operand
    }

    // Method to perform the calculation based on the selected operation
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand); // Parse the previous operand
        const current = parseFloat(this.currentOperand); // Parse the current operand

        // Return if either operand is NaN (not a valid number)
        if (isNaN(prev) || isNaN(current)) return;

        // Perform the appropriate calculation based on the operation
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }

        // Update the current operand with the result and reset the operation
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = ''; // Clear previous operand
    }

    // Method to format the numbers for display (add commas, decimals, etc.)
    getDisplayNumber(number) {
        const stringNumber = number.toString(); // Convert number to string
        const integerDigit = parseFloat(stringNumber.split('.')[0]); // Get integer part of the number
        const decimalDigit = stringNumber.split('.')[1]; // Get decimal part of the number
        let integerDisplay;

        // If integer part is NaN, set the display to an empty string
        if (isNaN(integerDigit)) {
            integerDisplay = '';
        } else {
            // Otherwise, format the integer part with commas (thousands separator)
            integerDisplay = integerDigit.toLocaleString('en', {
                maximumFractionDigits: 0 // Don't display decimals in integer part
            });
        }

        // If there's a decimal part, append it to the integer display
        if (decimalDigit != null) {
            return `${integerDisplay}.${decimalDigit}`;
        } else {
            return integerDisplay; // Return just the integer part
        }
    }

    // Method to update the displayed operands on the screen
    updateDisplay() {
        // Update the current operand display
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        // If an operation is selected, update the previous operand display
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = ''; // Clear previous operand if no operation is selected
        }
    }
}

// Select elements from the DOM
const numberButtons = document.querySelectorAll('[data-number]'); // Select all number buttons
const operationButtons = document.querySelectorAll('[data-operation]'); // Select all operation buttons
const equalsButtons = document.querySelector('[data-equals]'); // Select the equals button
const deleteButtons = document.querySelector('[data-delete]'); // Select the delete button
const allClearButtons = document.querySelector('[data-all-clear]'); // Select the all-clear button
const previousOperandTextElement = document.querySelector('[data-previous-operand]'); // Select previous operand display
const currentOperandTextElement = document.querySelector('[data-current-operand]'); // Select current operand display

// Create a new Calculator instance
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add event listeners to number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText); // Append number to current operand
        calculator.updateDisplay(); // Update the display
    });
});

// Add event listeners to operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText); // Choose the operation
        calculator.updateDisplay(); // Update the display
    });
});

// Add event listener to the equals button
equalsButtons.addEventListener('click', button => {
    calculator.compute(); // Perform the calculation
    calculator.updateDisplay(); // Update the display with the result
});

// Add event listener to the all-clear button
allClearButtons.addEventListener('click', button => {
    calculator.clear(); // Clear the calculator
    calculator.updateDisplay(); // Update the display
});

// Add event listener to the delete button
deleteButtons.addEventListener('click', button => {
    calculator.delete(); // Delete the last character from the current operand
    calculator.updateDisplay(); // Update the display
});
