import { Action, simpleCalculator } from './index';

describe('simpleCalculator tests', () => {
  const FIRST_OPERAND = 10;
  const SECOND_OPERAND = 5;
  const ADDITION_RESULT = 15;
  const SUBTRACTION_RESULT = 5;
  const MULTIPLICATION_RESULT = 50;
  const DIVISION_RESULT = 2;
  const EXPONENTIATION_RESULT = 100000;

  test('should add two numbers', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: Action.Add,
      }),
    ).toBe(ADDITION_RESULT);
  });

  test('should subtract two numbers', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: Action.Subtract,
      }),
    ).toBe(SUBTRACTION_RESULT);
  });

  test('should multiply two numbers', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: Action.Multiply,
      }),
    ).toBe(MULTIPLICATION_RESULT);
  });

  test('should divide two numbers', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: Action.Divide,
      }),
    ).toBe(DIVISION_RESULT);
  });

  test('should exponentiate two numbers', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: Action.Exponentiate,
      }),
    ).toBe(EXPONENTIATION_RESULT);
  });

  test('should return null for invalid action', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: SECOND_OPERAND,
        action: 'invalid action',
      }),
    ).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({
        a: FIRST_OPERAND,
        b: 'not a number',
        action: Action.Add,
      }),
    ).toBeNull();
  });
});
