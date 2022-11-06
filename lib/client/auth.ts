import RootApiHandler from "./fetch";

const Authentication = {
    login: async (username: string, password: string) => {
        type ResponseType = {
            message: string;
            access_token: string;
        };

        const { message, access_token } = await RootApiHandler.fetch<ResponseType>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            }),
        });

        localStorage.setItem("access_token", access_token);

        return {
            message,
            access_token,
        };
    },

    /**
     * Gets the access token that is stored on the local machine.
     * @returns The access token as a JWT token.
     */
    getAccessToken: () => {
        return localStorage.getItem("access_token");
    },

    /**
     * Checks if the user is logged in.
     * @returns true if the user is authenticated
     */
    isLoggedIn: () => {
        return !!Authentication.getAccessToken();
    },

    register: async (username: string, password: string) => {
        type ResponseType = {
            message: string;
        };

        const { message } = await RootApiHandler.fetch<ResponseType>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            }),
        });

        return {
            message,
        };
    },

    logout: () => {
        localStorage.removeItem("access_token");
    },
};

export default Authentication;