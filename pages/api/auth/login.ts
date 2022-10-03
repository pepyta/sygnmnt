import prisma from "@lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { middleware } from "@lib/server/middleware";
import { PasswordMismatchError, UnsupportedMethodError, UserNotFoundError } from "@lib/server/errors";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if the method is a POST request
    if(req.method !== "POST") throw new UnsupportedMethodError();

    // get input from user
    const body = JSON.parse(req.body);
    const username: string = body.username;
    const password: string = body.password;

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    // check if user exists
    if(!user) {
        throw new UserNotFoundError();
    }

    // check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if(!isCorrectPassword) {
        throw new PasswordMismatchError();
    }

    // generate JWT token for user
    const access_token = jsonwebtoken.sign({
        id: user.id,
        username: user.username,
    }, process.env.JWT_SECRET_KEY);

    return {
        access_token,
        message: "Successful authentication!",
    };
};

export default middleware(login);