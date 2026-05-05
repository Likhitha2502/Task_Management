import { AjaxError } from 'rxjs/ajax';

export const getResponseError = (error: AjaxError) => {
    if (!error) {
        return null;
    }

    return ({
        message: error?.response?.data?.message || error?.response?.data || error?.message
    });
};
