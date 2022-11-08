import { UnsupportedMethodError } from "@lib/server/errors";
import { middleware } from "@lib/server/middleware";
import Runner from "@lib/server/runner";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest) => {
    if(req.method === "POST") {
        const runner = new Runner(JSON.parse(req.body), "C");

        await runner.build({
            onError: console.error,
            onLog: console.log,
        });

        await runner.run({
            onError: console.error,
            onLog: console.log,
        });

        return {
            status: "BUILD_SUCCESS",
        };
    } else {
        throw new UnsupportedMethodError();
    }
};

export default middleware(handler);