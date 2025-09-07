export default function calc(expr: string): void {
    try {
        const processedExpr = expr.trim();
        const result = evaluatePolishNotation(processedExpr);
        console.log(result);
    } catch (e) {
        console.log("Invalid expression: " + (e as Error).message);
    }
}

function evaluatePolishNotation(expr: string): number {
    const tokens = tokenize(expr);
    const stack: (number | string)[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (isOperator(token)) {
            stack.push(token);
        } else {
            const num = parseFloat(token);
            if (isNaN(num)) {
                throw new Error("Неверный числовой токен: " + token);
            }
            stack.push(num);
            calculateStack(stack);
        }
    }

    if (stack.length !== 1 || typeof stack[0] !== "number") {
        throw new Error("Неверное выражение");
    }

    return stack[0] as number;
}

function calculateStack(stack: (number | string)[] = []) {
    while (
        stack.length >= 3 &&
        typeof stack[stack.length - 1] === "number" &&
        typeof stack[stack.length - 2] === "number" &&
        typeof stack[stack.length - 3] === "string"
    ) {
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        const operator = stack.pop() as string;

        const result = applyOperator(operator, a, b);
        stack.push(result);
    }
}

function tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let currentToken = "";
    let parenthesesDepth = 0;

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (char === "(") {
            if (parenthesesDepth === 0 && currentToken) {
                tokens.push(currentToken);
                currentToken = "";
            }
            parenthesesDepth++;
            currentToken += char;
        } else if (char === ")") {
            parenthesesDepth--;
            currentToken += char;
            if (parenthesesDepth === 0) {
                const innerExpr = currentToken.slice(1, -1);
                const innerResult = evaluatePolishNotation(innerExpr);
                tokens.push(innerResult.toString());
                currentToken = "";
            }
        } else if (char === " " && parenthesesDepth === 0) {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = "";
            }
        } else {
            currentToken += char;
        }
    }

    if (currentToken) {
        tokens.push(currentToken);
    }

    if (parenthesesDepth !== 0) {
        throw new Error("Несбалансированные скобки");
    }

    return tokens;
}

function isOperator(token: string): boolean {
    return token === "+" || token === "-" || token === "*" || token === "/";
}

function applyOperator(op: string, a: number, b: number): number {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) throw new Error("Деление на ноль");
            return a / b;
        default:
            throw new Error("Неизвестный оператор: " + op);
    }
}
