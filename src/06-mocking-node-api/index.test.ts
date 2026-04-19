import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  const TIMEOUT_DELAY = 5000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackSpy = jest.fn();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callbackSpy, TIMEOUT_DELAY);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callbackSpy, TIMEOUT_DELAY);
  });

  test('should call callback only after timeout', () => {
    const callbackSpy = jest.fn();

    doStuffByTimeout(callbackSpy, TIMEOUT_DELAY);

    jest.advanceTimersByTime(TIMEOUT_DELAY - 1);
    expect(callbackSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  const INTERVAL_DELAY = 2000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackSpy = jest.fn();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callbackSpy, INTERVAL_DELAY);

    expect(setIntervalSpy).toHaveBeenCalledWith(callbackSpy, INTERVAL_DELAY);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackSpy = jest.fn();

    doStuffByInterval(callbackSpy, INTERVAL_DELAY);

    jest.advanceTimersByTime(INTERVAL_DELAY * 2);

    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const PATH_TO_FILE = 'file.txt';
  const MOCK_FULL_PATH = 'mock/full/path/file.txt';
  const MOCK_FILE_CONTENT = 'mock file content';

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join').mockReturnValue(MOCK_FULL_PATH);
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await readFileAsynchronously(PATH_TO_FILE);

    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), PATH_TO_FILE);
    expect(existsSyncSpy).toHaveBeenCalledWith(MOCK_FULL_PATH);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(path, 'join').mockReturnValue(MOCK_FULL_PATH);
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const readFileSpy = jest.spyOn(fsPromises, 'readFile');

    await expect(readFileAsynchronously(PATH_TO_FILE)).resolves.toBeNull();
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(path, 'join').mockReturnValue(MOCK_FULL_PATH);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fsPromises, 'readFile')
      .mockResolvedValue(Buffer.from(MOCK_FILE_CONTENT));

    await expect(readFileAsynchronously(PATH_TO_FILE)).resolves.toBe(
      MOCK_FILE_CONTENT,
    );
  });
});
