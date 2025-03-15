"use client";

import { FC } from "react";
import { StateDisplayProps } from "./types";
import styles from "./StateDisplay.module.scss";
import { Icon } from "@repo/ui";
import clsx from "clsx";

const StateDisplay: FC<StateDisplayProps> = ({
  label,
  color,
  icon,
  onClick,
  width,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(styles.state_display_container)}
      data-color={color}
      style={{ width: width || "fit-content" }}
      data-click={!!onClick}
    >
      {icon && <Icon type={icon} size={12} />}
      {label}
    </div>
  );
};

export default StateDisplay;
