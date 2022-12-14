import { User } from "@prisma/client";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import decode from "jwt-decode";
import Authentication from "@lib/client/auth";
import { useMount } from "@lib/client/useMount";
import Membership from "@lib/client/membership";

export type UserProviderProps = PropsWithChildren<{}>;

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType>(null);

export const useUser = () => {
    const { user } = useContext(UserContext);

    return {
        user,
    };
};

export const useAuth = () => {
    const { setUser } = useContext(UserContext);

    const login = async (username: string, password: string) => {
        const { access_token, message } = await Authentication.login(username, password);
        setUser(decode(access_token));
        return {
            message,
        };
    };

    const logout = async () => {
        await Authentication.logout();
        setUser(null);
    };

    return {
        login,
        logout,
    };
};


const UserProvider = (props: UserProviderProps) => {
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    
    useMount(() => {
        const accessToken = localStorage.getItem("access_token");
        
        if(accessToken) {
            setUser(decode(accessToken));
        }

        setLoading(false);
    });

    const sync = async () => {
        if(!user) return;
        await Membership.getAll();
        await new Promise(r => setTimeout(r, 1000));
        return await sync();
    };

    useEffect(
        () => {
            sync();
        },
        [user],
    );
    
    if(isLoading) {
        return (
            <div />
        );
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;