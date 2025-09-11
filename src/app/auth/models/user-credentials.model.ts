export interface UserCredentials {
    email: string;
}

export interface UserResponse {
    done: boolean;
    message: string;
    token?: string;
    user?: any;
}
