import { IconButtonProps } from "./types";
import Link from "next/link";
import "./styles.scss";
import styles from "./IconButton.module.scss";
import clsx from "clsx";
import Icons from "./Icons";
import { FC } from "react";

const IconButton: FC<IconButtonProps> = ({
  icon,
  isLink,
  isBlank,
  link,
  onClick,
  isDarkButton = false,
  disabled,
  text,
  noBorder = false,
  size = 12,
  color,
}) => {
  if (!isLink && onClick)
    return (
      <button
        type="button"
        onClick={() => onClick()}
        className={styles.icon_button_container}
        data-isdark={isDarkButton}
        disabled={disabled}
        data-haslabel={text ? true : false}
        data-noborder={noBorder}
      >
        <div className={styles.icon_container} style={{ fontSize: size }}>
          <Icons icon={icon} color={color} />
        </div>
        <div className={clsx("label", styles.icon_label)}>{text}</div>
      </button>
    );
  if (isLink && link)
    return (
      <Link
        href={link}
        target={isBlank ? "_blank" : "_self"}
        style={{ fontSize: size }}
      >
        <button
          type="button"
          onClick={() => null}
          className={styles.icon_button_container}
          data-isdark={isDarkButton}
          disabled={disabled}
          data-haslabel={text ? true : false}
          data-noborder={noBorder}
        >
          <div className={styles.icon_container}>
            <Icons icon={icon} color={color} />
          </div>
          <div className="label">{text}</div>
        </button>
      </Link>
    );

  return null;
};

export default IconButton;
