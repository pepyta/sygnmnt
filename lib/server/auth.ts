import { User } from "@prisma/client";
import { NextApiRequest } from "next";
import * as jsonwebtoken from "jsonwebtoken";

export const Authentication = {
    getUser: (req: NextApiRequest): User => {
        // Bearer eyAscxeb....
        const authorizationKey = req.headers.authorization;
        if(!authorizationKey) return null;

        // eyAscxeb....
        const accessToken = authorizationKey.split(" ")[1];
        if(!accessToken) return null;

        return jsonwebtoken.verify(accessToken, process.env.JWT_SECRET_KEY) as User;
    },
};