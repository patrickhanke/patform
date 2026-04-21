import { FC, Fragment, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import "./styles.scss";
import { useOnClickOutside } from "usehooks-ts";
import { Divider, Icon } from "@repo/ui";
import { getImageUrl, logoutUser } from "@repo/provider";
import { UserMenuProps } from "./types";
import Image from "next/image";

const UserMenu: FC<UserMenuProps> = ({
  user,
  setUserMenu,
  setUserPassword,
}) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setUserMenu(false);
  });

  const userMenu = useMemo(() => {
    const menuArray = [
      // {
      //   label: "Profil",
      //   onClick: () => {
      //     setUserSettings(true);
      //     setUserMenu(false);
      //   },
      // },
      {
        label: "Passwort ändern",
        onClick: () => {
          setUserPassword(true);
          setUserMenu(false);
        },
      },
      {
        label: "Logout",
        onClick: () => logoutUser(),
      },
    ];

    return menuArray;
  }, [user]);

  return (
    <motion.div
      className="user_menu_container"
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.2 }}
      ref={ref}
    >
      <div>
        <div className="user_menu_header">
          <div className="user_menu_portrait_container">
            {user.portrait ? (
              <Image
                src={getImageUrl({
                  fileName: user.portrait.name,
                  width: 80,
                  height: 80,
                })}
                height={40}
                width={40}
                alt={user.label}
              />
            ) : (
              <Icon
                type="circle-user-round"
                size={40}
                strokeWidth={2}
                color={"#999999"}
              />
            )}
          </div>
          <div>
            <h4>{user.label}</h4>
            <p>{user.email}</p>
          </div>
        </div>
        <Divider size="none" showLine />
      </div>
      {userMenu.map((menuItem, index) => (
        <Fragment key={menuItem.label}>
          <motion.div className="user_menu_item" onClick={menuItem.onClick}>
            {menuItem.label}
          </motion.div>
          {index === userMenu.length - 2 && <Divider size="none" showLine />}
        </Fragment>
      ))}
    </motion.div>
  );
};

export default UserMenu;
