export type LoginRequest = {
    authGuid: string;
    jwt: string;
    email: string;
    password: string;
    appName: string;
};

export type EmailPassword = {
    email: string;
    password: string;
}