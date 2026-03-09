"use client";

import styles from "./UserDisplay.module.scss";
import { Icon } from "@repo/ui";
import { FC, useCallback, useEffect, useState } from "react";
import { axiosclient, getImageUrl } from "@repo/provider";
import { UserDisplayProps } from "./types";
import UserSettings from "./components/UserSettings";
import { PatstoreUser } from "@repo/types";
import { AnimatePresence } from "motion/react";
import UserMenu from "./content/UserMenu/UserMenu";
import UserPassword from "./components/UserPassword";
import ProjectSelection from "./components/ProjectSelection";
import { Avatar } from "@chakra-ui/react";

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
        <Avatar.Root
					// colorPalette={worker.color}
					size={"2xs"}
					// css={ringCss}
				>
					<Avatar.Fallback name={`${user.name}`} />
					<Avatar.Image
						src={getImageUrl({
							fileName: user?.portrait?.name || "",
							width:  24 * 4 ,
							height:  24 * 4 
						})}
					/>
				</Avatar.Root>
        </div>

        <Icon type="arrow-down" size={15} strokeWidth={2} />

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
