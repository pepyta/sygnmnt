import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import * as jsonwebtoken from "jsonwebtoken";
import { PasswordMismatchError, UsernameAlreadyTakenError, UserNotFoundError } from "./errors";
import * as bcrypt from "bcryptjs";
import prisma from "./prisma";

export const Authentication = {
    verifyToken: (accessToken: string): User => {
        return jsonwebtoken.verify(accessToken, process.env.JWT_SECRET_KEY) as User
    },

    getUser: (req: NextApiRequest): User => {
        // Bearer eyAscxeb....
        const authorizationKey = req.headers.authorization || req.headers.Authorization as string;
        if (!authorizationKey) return null;

        // eyAscxeb....
        const accessToken = authorizationKey.split(" ")[1];
        if (!accessToken) return null;

        return Authentication.verifyToken(accessToken);
    },

    login: async (username: string, password: string) => {

        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        // check if user exists
        if (!user) {
            throw new UserNotFoundError();
        }

        // check if password is correct
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            throw new PasswordMismatchError();
        }

        // generate JWT token for user
        const access_token = jsonwebtoken.sign({
            id: user.id,
            username: user.username,
        }, process.env.JWT_SECRET_KEY);

        return access_token;
    },

    register: async (username: string, password: string) => {
        // check if username is already taken
        const isTaken = await Authentication.isUsernameTaken(username);
        if (isTaken) throw new UsernameAlreadyTakenError();

        // encrypt password to be stored in the database
        const encryptedPassword = await bcrypt.hash(password, 8);

        // create user in the databse
        await prisma.user.create({
            data: {
                username,
                password: encryptedPassword,
            },
        });

        return true;
    },

    /**
     * Checks if the username is taken.
     * @param username The username that we want to check.
     * @returns A boolean as result.
     */
    isUsernameTaken: async (username: string) => {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (user) {
            return true;
        } else {
            return false;
        }
    },
};