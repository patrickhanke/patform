"use client";

import React, { useRef } from "react";
import styles from "./SlideInRight.module.scss";
import clsx from "clsx";

import { useOnClickOutside } from "usehooks-ts";

type SlideInRightComponent = {
  children: React.ReactNode;
  header: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "small" | "medium" | "large";
  preventClickOutside?: boolean;
};

const SlideInRight = ({
  children,
  header,
  isOpen,
  setIsOpen,
  preventClickOutside,
  size = "small",
}: SlideInRightComponent) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (preventClickOutside === true) return;
    setIsOpen(false);
  });

  return (
    <>
      <div className={styles.overlay_container} data-isopen={isOpen} />
      <div
        ref={ref}
        className={clsx(
          styles.slidein_container,
          isOpen === true && styles.is_open
        )}
        data-size={size}
      >
        {isOpen && (
          <>
            <div className={styles.slidein_header}>
              <h3>{header}</h3>
            </div>
            <div className={styles.slidein_content}>{children}</div>
          </>
        )}
      </div>
    </>
  );
};

export default SlideInRight;
