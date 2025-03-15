"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import UserContext from "./UserContext";
import { axiosclient } from "@repo/provider";
import Cookies from "js-cookie";
import { User } from "@repo/types";
import { useSessionStorage } from "usehooks-ts";

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const token = Cookies.get(process.env.SESSION_TOKEN as string);
  const [project, setProject] = useSessionStorage<string | undefined>(
    "project",
    undefined,
    { initializeWithValue: true },
  );
  const [user, setUser] = useSessionStorage<User | undefined>(
    "user",
    undefined,
    { initializeWithValue: true },
  );

  const changeProject = (id: string) => {
    setProject(id);
    window.location.reload();
  };

  const getUserData = useCallback(async () => {
    axiosclient()
      .get("/users/me")
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        }
        if (response.data.project) {
          setProject(response.data.project.objectId);
        }
      })
      .catch((error) => console.error(error.message));
  }, []);

  const userContextObject = useMemo(
    () => ({
      user: user as User,
      projectId: project || "",
      changeProject,
      getUserData,
    }),
    [token, user],
  );

  useEffect(() => {
    if (token && !user) {
      getUserData();
    }
  }, []);

  return (
    <UserContext.Provider value={userContextObject}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
