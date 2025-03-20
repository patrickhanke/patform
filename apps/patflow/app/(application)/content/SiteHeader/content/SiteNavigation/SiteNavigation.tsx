import React from "react";
import styles from "./SiteNavigation.module.scss";
import { SwitchButtons } from "@repo/ui";
import { SiteNavigationComponent } from "../../types";

const SiteNavigation = ({
  items = [],
  currentItem,
  onClick,
}: SiteNavigationComponent) => {
  if (items.length > 0)
    return (
      <div className={styles.site_navigation_container}>
        <SwitchButtons
          buttonStates={items}
          currentStates={currentItem}
          changeHandler={(value) => onClick(value)}
          underlineButtons
        />
      </div>
    );
  return null;
};

export default SiteNavigation;
