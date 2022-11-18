import { NextApiRequest, NextApiResponse } from "next";
import { middleware } from "@lib/server/middleware";
import { Authentication } from "@lib/server/auth";
import { UnsupportedMethodError } from "@lib/server/errors";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if the request is a POST method
    if(req.method !== "POST") throw new UnsupportedMethodError();
    
    // extract data from user input
    const body = JSON.parse(req.body);
    const username: string = body.username;
    const password: string = body.password;

    await Authentication.register(username, password);

    return {
        message: "Successful registration!",
    };
};


export default middleware(login);