import type { AxiosError } from 'axios';

export const getResponseError = (error: AxiosError<{ message?: string }>): string | null | undefined => {
    if (!error) return null;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data !== undefined) return error.response.data as unknown as string;
    return error?.message;
};
