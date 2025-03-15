import React from "react";

interface InputProps {
  name: string;
  label?: string;
  id?: string;
  type?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  values: { [key: string]: any };
  handleBlur: (value: string) => void;
  placeholder?: string;
  isHorizontal?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  id,
  type = "text",
  handleChange,
  values,
  handleBlur,
  placeholder,
  isHorizontal,
}) => {
  return (
    <div className={isHorizontal ? "form_horizontal_container" : ""}>
      <label htmlFor={name}>{label || name}</label>
      <input
        id={id}
        name={name}
        type={type}
        onChange={handleChange}
        defaultValue={values[name] || ""}
        onBlur={(e) => handleBlur(e.target.value)}
        placeholder={placeholder}
        key={name}
      />
    </div>
  );
};

export default Input;
