import React, { useCallback, useState } from "react";
import "./styles.scss";

const ToggleSwitch = ({ onChange, value, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(value);

  const handleToggle = useCallback(() => {
    onChange(!value);
  }, [value]);

  return (
    <div className="can-toggle">
      <input id="a" type="checkbox" />
      <label htmlFor="a">
        <div
          className="can-toggle__switch"
          data-checked="Yes"
          data-unchecked="No"
        ></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
