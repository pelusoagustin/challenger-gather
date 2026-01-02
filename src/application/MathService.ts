import type { IMathService } from "./ports/IMathService";

export class MathService implements IMathService {
  getLeastCommonMultiple(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("EMPTY_NUMBERS");
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i += 1) {
      result = lcm(result, numbers[i]);
    }
    return result;
  }

  increment(value: number): number {
    return value + 1;
  }
}

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  const g = gcd(a, b);
  return Math.abs((a / g) * b);
};
