import { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "@lib/server/middleware";
import { UnsupportedMethodError } from "@lib/server/errors";
import { Authentication } from "@lib/server/auth";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if the method is a POST request
    if (req.method !== "POST") throw new UnsupportedMethodError();

    // get input from user
    const body = JSON.parse(req.body);
    const username: string = body.username;
    const password: string = body.password;

    const access_token = await Authentication.login(username, password);

    return {
        access_token,
        message: "Successful authentication!",
    };
};

export default middleware(login);