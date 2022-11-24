import * as Prisma from "@prisma/client";
import Authentication from "./auth";
import RootApiHandler from "./fetch";

export type InvitationType = Prisma.Invitation & {
    team: Prisma.Team;
};

export default class Invitation {
    /**
     * Gets all of the invitations from the server as an array.
     */
    public static async getAll(): Promise<InvitationType[]> {
        return await RootApiHandler.fetch("/invitation", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
    }
}