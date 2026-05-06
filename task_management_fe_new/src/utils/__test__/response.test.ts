/// <reference types="jest" />
import { getResponseError } from '../response';

describe('getResponseError', () => {
  it('returns null when error is null', () => {
    expect(getResponseError(null as any)).toBeNull();
  });

  it('returns null when error is undefined', () => {
    expect(getResponseError(undefined as any)).toBeNull();
  });

  it('returns null when error is a falsy value', () => {
    expect(getResponseError(0 as any)).toBeNull();
  });

  it('returns message from error.response.data.message', () => {
    const error = { response: { data: { message: 'Unauthorized' } } } as any;
    expect(getResponseError(error)).toEqual('Unauthorized');
  });

  it('falls back to error.response.data when data has no message field', () => {
    const error = { response: { data: { message: 'Not Found' } }} as any;
    expect(getResponseError(error)).toEqual('Not Found');
  });

  it('falls back to error.message when there is no response', () => {
    const error = { message: 'Network Error' } as any;
    expect(getResponseError(error)).toEqual('Network Error');
  });

  it('prefers error.response.data.message over error.response.data', () => {
    const error = {
      response: { data: { message: 'Specific message' } },
      message: 'Generic message',
    } as any;
    expect(getResponseError(error)).toEqual('Specific message');
  });

  it('prefers error.response.data over error.message', () => {
    const error = {
      response: { data: 'Response data string' },
      message: 'Generic message',
    } as any;
    expect(getResponseError(error)).toEqual('Response data string');
  });

  it('returns an object with an undefined message when all fields are absent', () => {
    const error = {} as any;
    expect(getResponseError(error)).toEqual(undefined);
  });
});
