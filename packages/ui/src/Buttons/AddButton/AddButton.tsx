"use client";

import { FC, useState } from "react";
import styles from "./AddButton.module.scss";
import { VscAdd } from "react-icons/vsc";
import { AddButtonProps } from "./types";

const AddButton: FC<AddButtonProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={styles.add_button}
        data-isopen={isOpen}
        data-iconslength={items.length.toString()}
      >
        <div
          className={styles.add_button_container}
          data-isopen={isOpen}
          data-iconslength={items.length.toString()}
        >
          <div
            className={styles.add_button_icon}
            data-isopen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <VscAdd />
          </div>
        </div>
        <div className={styles.icons_container}>
          {items.map((item) => (
            <div
              data-isopen={isOpen}
              className={styles.icon}
              key={item.title}
              onClick={item.onClick}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddButton;
