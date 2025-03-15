"use client";

import React from "react";
import { User } from "@repo/types";

interface ContextValues {
  user: User;
  projectId: string;
  changeProject: (id: string) => void;
  getUserData: () => void;
}

const UserContext = React.createContext({} as ContextValues);

export default UserContext;
