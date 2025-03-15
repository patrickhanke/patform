import { ToggleType } from "../types";
import "../styles.scss";

const Toggle = ({
  toggleState = false,
  toggleHandler,
  disabled = false,
  label = "",
  labelBefore = false,
}: ToggleType) => (
  <div className={"toggle_container"} data-labelBefore={labelBefore}>
    {label && <label htmlFor={label.toLowerCase()}>{label}</label>}
    <div
      style={{ scale: 0.8 }}
      onClick={() => {
        if (disabled === false) {
          toggleHandler(!toggleState);
        }
        return null;
      }}
      className={"toggle_container"}
    >
      <div
        className={"toogle_container_background"}
        data-disabled={disabled}
        data-toggleState={toggleState}
      />
      <div
        className={"toggle_container_circle"}
        data-disabled={disabled}
        data-toggleState={toggleState}
      />
    </div>
  </div>
);

export default Toggle;
