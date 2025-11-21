export default function calc(expression: string) {
    try {
        expression = expression.trim();
        const result = processExpression(expression);
        console.log(expression + " = " + result);
    } catch (e) {
        console.log("Invalid expression: " + e);
    }
}

type TokensStack<T = string | number> = T[];

function processExpression(expression: string): number {
  const tokens = tokenize(expression);
  const stack: TokensStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (isOperator(token)) {
      stack.push(token);
    } else {
      const num = parseFloat(token);
      if (isNaN(num)) throw new Error("Invalid num token: " + token);

      stack.push(num);
      calculateStack(stack);
    }
  }

  if (stack.length !== 1 || typeof stack[0] !== "number") {
    throw new Error("Invalid expression");
  }

  return stack[0] as number;
}

const isOperator = (token: string): boolean => {
  return "+-*/".includes(token) && token.length == 1;
};

function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  let token = "";
  let depth = 0;

  for (const char of expression) {
    if (char === "(") {
      if (depth === 0 && token) {
        tokens.push(token);
        token = "";
      }
      depth++;
    } else if (char === ")") {
      depth--;
      token += char;
      if (depth === 0) {
        const innerExpr = token.slice(1, -1);
        const innerResult = processExpression(innerExpr);
        tokens.push(innerResult.toString());
        token = "";
      }
    } else if (char === " " && depth === 0) {
      if (token) {
        tokens.push(token);
        token = "";
      }
    } else {
      token += char;
    }
  }

  if (token) tokens.push(token);

  if (depth !== 0) throw new Error("Invalid brackets");

  return tokens;
}

const calculateStack = (stack: TokensStack) => {
  while (canApplyOperation(stack)) {
    const b = stack.pop() as number;
    const a = stack.pop() as number;
    const operator = stack.pop() as string;

    const result = applyOperator(operator, a, b);
    stack.push(result);
  }
};

const canApplyOperation = (stack: TokensStack) => {
  return (
    stack.length >= 3 &&
    typeof stack[stack.length - 1] === "number" &&
    typeof stack[stack.length - 2] === "number" &&
    typeof stack[stack.length - 3] === "string"
  );
};

const applyOperator = (operator: string, a: number, b: number): number => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) throw new Error("Zero division error");
      return a / b;
    default:
      throw new Error("Unknown operation: " + operator);
  }
};

if (typeof process !== 'undefined' && process.argv) {
    if (process.argv.length > 2) {
        const expression = process.argv.slice(2).join(' ');
        calc(expression);
    } else {
        console.log("Polish Notation Calculator");
        console.log("Usage: ts-node calc.ts '<expression>'");
        console.log("Example: ts-node calc.ts '+ 3 4'");
        console.log("Example: ts-node calc.ts \"* (- 5 6) 7\"");
    }
}
