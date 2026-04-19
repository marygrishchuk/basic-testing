import lodash from 'lodash';

import {
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  const INITIAL_BALANCE = 100;
  const DEPOSIT_AMOUNT = 50;
  const WITHDRAW_AMOUNT = 40;
  const TRANSFER_AMOUNT = 30;
  const FETCHED_BALANCE = 275;

  test('should create account with initial balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);

    expect(account.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(INITIAL_BALANCE);

    expect(() => account.withdraw(INITIAL_BALANCE + 1)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const sourceAccount = getBankAccount(INITIAL_BALANCE);
    const destinationAccount = getBankAccount(0);

    expect(() =>
      sourceAccount.transfer(INITIAL_BALANCE + 1, destinationAccount),
    ).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(INITIAL_BALANCE);

    expect(() => account.transfer(TRANSFER_AMOUNT, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(INITIAL_BALANCE);

    expect(account.deposit(DEPOSIT_AMOUNT)).toBe(account);
    expect(account.getBalance()).toBe(INITIAL_BALANCE + DEPOSIT_AMOUNT);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(INITIAL_BALANCE);

    expect(account.withdraw(WITHDRAW_AMOUNT)).toBe(account);
    expect(account.getBalance()).toBe(INITIAL_BALANCE - WITHDRAW_AMOUNT);
  });

  test('should transfer money', () => {
    const sourceAccount = getBankAccount(INITIAL_BALANCE);
    const destinationAccount = getBankAccount(0);

    expect(sourceAccount.transfer(TRANSFER_AMOUNT, destinationAccount)).toBe(
      sourceAccount,
    );
    expect(sourceAccount.getBalance()).toBe(INITIAL_BALANCE - TRANSFER_AMOUNT);
    expect(destinationAccount.getBalance()).toBe(TRANSFER_AMOUNT);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomSpy = jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(FETCHED_BALANCE)
      .mockReturnValueOnce(1);
    const account = getBankAccount(INITIAL_BALANCE);

    await expect(account.fetchBalance()).resolves.toBe(FETCHED_BALANCE);
    expect(randomSpy).toHaveBeenCalledTimes(2);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(FETCHED_BALANCE)
      .mockReturnValueOnce(1);
    const account = getBankAccount(INITIAL_BALANCE);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(FETCHED_BALANCE);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(FETCHED_BALANCE)
      .mockReturnValueOnce(0);
    const account = getBankAccount(INITIAL_BALANCE);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
