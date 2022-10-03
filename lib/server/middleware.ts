import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleErrors = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            return await handler(req, res);
        } catch(e) {
            res.status(400);
            res.json({
                message: e.message,
            });
        }
    };
};

const handleResponse = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const result = await handler(req, res);
        res.json(result);
    };
};

export const middleware = (handler: NextApiHandler) => handleErrors(handleResponse(handler));