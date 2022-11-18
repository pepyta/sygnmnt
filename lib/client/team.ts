import { GetTeamByIdResponseType } from "@lib/server/team";
import { Team as PrismaTeam } from "@prisma/client";
import Authentication from "./auth";
import RootApiHandler from "./fetch";

const Team = {
    getByID: async (id: string) => {
        const resp: GetTeamByIdResponseType = await RootApiHandler.fetch(`/api/team/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${Authentication.getAccessToken()}`,
            },
        });
        
        return resp;
    },
    
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

    update: async (teamId: string, name: string) => {
        type ResponseType = {
            message: string;
            team: GetTeamByIdResponseType;
        };

        const { team, message }: ResponseType = await RootApiHandler.fetch(`/api/team/${teamId}`, {
            method: "PATCH",
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
