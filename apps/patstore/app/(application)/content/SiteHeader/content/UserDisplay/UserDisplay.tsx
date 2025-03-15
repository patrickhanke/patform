"use client";

import styles from "./UserDisplay.module.scss";

import { Icon, MessageIndicator } from "@repo/ui";

import { FC, useCallback, useEffect, useState } from "react";

import { axiosclient, getImageUrl } from "@repo/provider";

import { UserDisplayProps } from "./types";

import UserSettings from "./components/UserSettings";

import { PatstoreUser } from "@repo/types";

import { AnimatePresence } from "motion/react";

import UserMenu from "./content/UserMenu/UserMenu";

import UserPassword from "./components/UserPassword";

import ProjectSelection from "./components/ProjectSelection";
import Image from "next/image";

const UserDisplay: FC<UserDisplayProps> = ({ userMessages = false }) => {
  const [userSettings, setUserSettings] = useState(false);

  const [userPassword, setUserPassword] = useState(false);

  const [selectProject, setSelectProject] = useState(false);

  const [userMenu, setUserMenu] = useState(false);

  const [user, setUser] = useState<PatstoreUser | null>(null);

  const getUser = useCallback(async () => {
    await axiosclient()
      .get("/users/me")

      .then((response) => {
        setUser(response.data);
      })

      .catch((error) => console.error(error.message));
  }, []);

  const userShort = (username: string) => {
    console.log(username);

    if (!username) {
      return "U";
    }

    const nameParts = username.split(" ");

    console.log(nameParts);

    if (nameParts.length === 1 && nameParts[0]) {
      return nameParts[0][0];
    } else if (
      nameParts.length > 1 &&
      nameParts[0] &&
      nameParts[nameParts.length - 1] &&
      nameParts[nameParts.length - 1]?.length > 0
    ) {
      return `${nameParts[0]?.[0] ?? ""}${nameParts[nameParts.length - 1]?.[0] ?? ""}`;
    }

    return "U";
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      <div
        className={styles.user_container}
        onClick={() => setUserMenu(!userMenu)}
      >
        <div className={styles.user_image_container}>
          {user.portrait ? (
            <Image
              src={getImageUrl({
                filePath: user?.portrait,
                width: 60,
                height: 60,
              })}
              alt={user.label}
              width={24}
              height={24}
            />
          ) : (
            <div className={styles.display_user_no_image} data-onlyimage={true}>
              <div
                className={styles.display_user_no_image_background}
                style={{ backgroundColor: "#B3DAF9" }}
              />

              <div
                className={styles.display_user_no_image_character}
                style={{ color: "#0D3A7F" }}
              >
                {userShort(user.label)}
              </div>
            </div>
          )}
        </div>

        <Icon type="arrow-down" size={15} strokeWidth={2} />

        {userMessages && <MessageIndicator />}

        <AnimatePresence initial={false}>
          {userMenu && (
            <UserMenu
              user={user}
              setUserMenu={setUserMenu}
              setUserSettings={setUserSettings}
              setUserPassword={setUserPassword}
              setSelectProject={setSelectProject}
            />
          )}
        </AnimatePresence>
      </div>

      {user && userSettings && (
        <UserSettings
          user={user}
          userSettings={userSettings}
          setUserSettings={setUserSettings}
          getUser={getUser}
        />
      )}

      {user && userPassword && (
        <UserPassword
          user={user}
          userPassword={userPassword}
          setUserPassword={setUserPassword}
        />
      )}

      {user && selectProject && (
        <ProjectSelection
          projects={user.projects}
          selectProject={selectProject}
          setSelectProject={setSelectProject}
        />
      )}
    </>
  );
};

export default UserDisplay;
