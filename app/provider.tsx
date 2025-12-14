// components/UserProvider.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState<any>()

    useEffect(() => {
        if (user) {
            createNewUser();
        }
    }, [user]);


    const createNewUser = async () => {
        try {
            const res = await axios.post("/api/users");
            console.log("User sync:", res.data);
            setUserDetail(res.data?.user)
        } catch (err) {
            console.error("Failed to create user", err);
        }
    };

    return <>
        <UserDetailContext value={{userDetail, setUserDetail}}>

            {children}
        </UserDetailContext>
    </>;
};

export default UserProvider;
