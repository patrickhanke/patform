import React from "react";
import styles from "./ContentElement.module.scss";
import clsx from "clsx";

const ContentElement = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div
      className={clsx([
        "content_element",
        "no_padding",
        styles.content_element_container,
      ])}
    >
      {title && (
        <div className={styles.content_element_title}>
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default ContentElement;
