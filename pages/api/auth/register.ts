import prisma from "@lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";
import { middleware } from "@lib/server/middleware";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if the request is a POST method
    if(req.method !== "POST") throw new Error("Unsupported method!");
    
    // extract data from user input
    const body = JSON.parse(req.body);
    const username: string = body.username;
    const password: string = body.password;

    // check if username is already taken
    const isTaken = await isUsernameTaken(username);
    if(isTaken) throw new Error("Username already taken!");

    // encrypt password to be stored in the database
    const encryptedPassword = await bcrypt.hash(password, 8);

    // create user in the databse
    await prisma.user.create({
        data: {
            username,
            password: encryptedPassword,
        },
    });

    return {
        message: "Successful registration!",
    };
};

/**
 * Checks if the username is taken.
 * @param username The username that we want to check.
 * @returns A boolean as result.
 */
const isUsernameTaken = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if(user) {
        return true;
    } else {
        return false;
    }
};

export default middleware(login);