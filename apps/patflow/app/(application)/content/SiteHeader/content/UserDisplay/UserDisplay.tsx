"use client";

import "./styles.scss";
import { Icon, MessageIndicator } from "@repo/ui";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { getImageUrlFromBytescale, NotificationContext, UserContext } from "@repo/provider";
import { UserDisplayProps } from "./types";
import { AnimatePresence } from "motion/react";
import UserMenu from "./content/UserMenu/UserMenu";
import UserPassword from "./components/UserPassword";
import Image from "next/image";

const UserDisplay: FC<UserDisplayProps> = ({ userMessages = false }) => {
    const [userPassword, setUserPassword] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const { user } = useContext(UserContext);
    const [client, setClient] = useState(false);
    const { unreadNotifications } = useContext(NotificationContext);

    const userData = useMemo(() => {
        if (user && user.portrait) {
        return {
            url: getImageUrlFromBytescale({
            filePath: user.portrait,
            width: 60,
            height: 60,
            }),
            alt: `${user.first_name} ${user.family_name}`,
        };
        }
        return {
        url: "",
        alt: "",
        };
    }, [user]);

    useEffect(() => {
        setClient(true);
    }, []);

    return (
        <>
        <div className="button_container">
            <div
                className={"patflow_user_container"}
                onClick={() => setUserMenu(!userMenu)}
            >
            <div className={"patflow_user_image_container"}>
                {client && userData.url ? (
                    <Image src={userData.url} alt={userData.alt} width={24} height={24} />
                ) : (
                    <div className={"patflow_user_image_placeholder"} />
                )}
                </div>
                <Icon type="arrow-down" size={15} strokeWidth={2} />
                {userMessages && <MessageIndicator notifications={unreadNotifications} />}
            </div>

            <AnimatePresence initial={false}>
            {userMenu && (
                <UserMenu
                user={user}
                setUserMenu={setUserMenu}
                //   setUserSettings={setUserSettings}
                setUserPassword={setUserPassword}
                //   setSelectProject={setSelectProject}
                />
            )}
            </AnimatePresence>
        </div>

        {user && userPassword && (
            <UserPassword
            user={user}
            userPassword={userPassword}
            setUserPassword={setUserPassword}
            />
        )}
        </>
    );
};

export default UserDisplay;
