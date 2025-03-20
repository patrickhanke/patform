"use client";

import { BiLogOut } from "react-icons/bi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { axiosclient, logoutUser } from "@repo/provider";
import "../styles.scss";

const Logout = () => {
  const router = useRouter();

  return (
    <div onClick={() => logoutUser()} className={"menu_item"}>
      <BiLogOut /> <div className="sidebar_label">Logout</div>
    </div>
  );
};

export default Logout;
