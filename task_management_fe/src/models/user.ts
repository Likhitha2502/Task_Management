export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    file?: File;
}

export interface ProfilePayload {
    email: string;
    firstName: string;
    lastName: string;
    file: File;
};
