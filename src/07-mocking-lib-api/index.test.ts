jest.mock('axios', () => {
  return {
    __esModule: true,
    default: {
      create: jest.fn(),
    },
  };
});

jest.mock('lodash', () => {
  const originalModule = jest.requireActual<typeof import('lodash')>('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((functionToThrottle) => functionToThrottle),
  };
});

import axios from 'axios';

import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  const RELATIVE_PATH = '/todos/1';
  const RESPONSE_DATA = { id: 1, title: 'mocked todo' };
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  function buildAxiosInstance(getSpy: jest.Mock) {
    return {
      get: getSpy,
    } as unknown as ReturnType<typeof axios.create>;
  }

  test('should create instance with provided base url', async () => {
    const getSpy = jest.fn().mockResolvedValue({ data: RESPONSE_DATA });
    const createSpy = jest.mocked(axios.create);

    createSpy.mockReturnValue(buildAxiosInstance(getSpy));

    await throttledGetDataFromApi(RELATIVE_PATH);

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: BASE_URL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const getSpy = jest.fn().mockResolvedValue({ data: RESPONSE_DATA });

    jest.mocked(axios.create).mockReturnValue(buildAxiosInstance(getSpy));

    await throttledGetDataFromApi(RELATIVE_PATH);

    expect(getSpy).toHaveBeenCalledWith(RELATIVE_PATH);
  });

  test('should return response data', async () => {
    const getSpy = jest.fn().mockResolvedValue({ data: RESPONSE_DATA });

    jest.mocked(axios.create).mockReturnValue(buildAxiosInstance(getSpy));

    await expect(throttledGetDataFromApi(RELATIVE_PATH)).resolves.toEqual(
      RESPONSE_DATA,
    );
  });
});
