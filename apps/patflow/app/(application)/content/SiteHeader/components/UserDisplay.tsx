"use client";

import styles from "../SiteHeader.module.scss";
import { MessageIndicator } from "@repo/ui";
import { useContext, useEffect, useMemo, useState } from "react";
import { getImageUrl } from "@repo/provider";
import Image from "next/image";
import { NotificationContext, UserContext } from "@provider";

const UserDisplay = ({ userMessages = false }: { userMessages: boolean }) => {
  const { user } = useContext(UserContext);
  const [client, setClient] = useState(false);
  const {unreadNotifications} = useContext(NotificationContext);

  const userData = useMemo(() => {
    if (user && user.portrait) {
      return {
        url: getImageUrl({
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
    <div className={styles.user_container}>
      <div className={styles.user_image_container}>
        {client && userData.url ? (
          <Image src={userData.url} alt={userData.alt} width={24} height={24} />
        ) : (
          <div className={styles.user_image_placeholder} />
        )}
      </div>
      {userMessages && <MessageIndicator notifications={unreadNotifications} />}
    </div>
  );
};

export default UserDisplay;
