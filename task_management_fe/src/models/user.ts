export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    profilePicture?: File;
    profilePictureUrl?: string;
}

export interface ProfilePayload {
    firstName: string;
    lastName: string;
    profilePicture?: File;
};
