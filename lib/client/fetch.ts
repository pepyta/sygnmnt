export default class RootApiHandler {
    public static async fetch<T = any>(input: RequestInfo | URL, init?: RequestInit) {
        const resp = await this.getResponse(input, init);
        const data: T = await resp.json();

        if(!resp.ok) {
            // @ts-ignore
            throw new Error(data.message);
        }

        return data;
    }

    public static async getResponse(input: RequestInfo | URL, init?: RequestInit) {
        try {
            return await fetch(input, init);
        } catch {
            throw new Error("Failed to connect to the server.");
        }
    }
}