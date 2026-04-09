export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    profilePicture?: File;
}

export interface ProfilePayload {
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    profilePicture?: File;
};
