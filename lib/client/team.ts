import { Team as PrismaTeam } from "@prisma/client";
import Authentication from "./auth";
import RootApiHandler from "./fetch";

const Team = {
    
    getAll: async () => {
        type ResponseType = {
            teams: PrismaTeam[];
        };

        const { teams }: ResponseType = await RootApiHandler.fetch("/api/team", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        return {
            teams,
        };
    },

    create: async (name: string) => {
        type ResponseType = {
            team: PrismaTeam;
            message: string;
        };

        const { team, message }: ResponseType = await RootApiHandler.fetch("/api/team", {
            method: "POST",
            body: JSON.stringify({
                name,
            }),
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });

        return {
            team,
            message,
        };
    },
};

export default Team;