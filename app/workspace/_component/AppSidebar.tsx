"use client"

import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Progress } from "@/components/ui/progress";
import { UserButton } from "@clerk/clerk-react";

export function AppSidebar() {

    const [projectList, setProjectList] = useState([])
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-evenly">
                    <Image src="/logo.svg" alt="logo" width={35} height={35} />
                    <h2 className="font-bold text-xl">AI Website Generator</h2>
                </div>

                <Link href={'/workspace'} className="mt-5 mx-auto w-full">
                    <Button className="w-full">
                        + Add New Project
                    </Button>
                </Link>
            </SidebarHeader>

            <SidebarContent className="p-2">
                <SidebarGroup />
                <SidebarGroupLabel>Projects</SidebarGroupLabel>
                {projectList.length == 0 &&
                    <h2 className="text-sm px-2 text-gray-500">No Project Found</h2>
                }
                <SidebarGroup />
            </SidebarContent>

            <SidebarFooter className="p-2">
                <div className="p-3 border rounded-xl space-y-3 bg-secondary">
                    <h2 className="flex justify-between items-center ">Remaining Credits <span className="font-bold">{userDetail?.credits}</span></h2>
                    <Progress value={33} />
                    <Button className="w-full">
                        Upgrade to Unlimited
                    </Button>

                </div>
                <div className="flex items-center gap-2">

                    <UserButton />
                    <Button variant={'ghost'}>Settings</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
