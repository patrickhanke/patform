import { FC } from "react";
import styles from "../RenderFields.module.scss";
import { SelectToggleProps } from "../types";

const SelectToggle: FC<SelectToggleProps> = ({
  value,
  valueChangeHandler,
  disabled,
  labelBefore,
}) => {
  return (
    <div
      className={styles.select_toggle_content}
      data-labelbefore={labelBefore}
    >
      <button
        onClick={() => valueChangeHandler(false)}
        className={styles.select_toggle_button}
        data-isactive={value === false}
        disabled={disabled}
      >
        Nein
      </button>
      <div className={styles.select_toggle_divider} />
      <button
        onClick={() => valueChangeHandler(true)}
        className={styles.select_toggle_button}
        data-isactive={value === true}
        disabled={disabled}
      >
        Ja
      </button>
    </div>
  );
};

export default SelectToggle;
