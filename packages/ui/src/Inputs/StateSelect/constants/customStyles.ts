import { StylesConfig } from "react-select";

const customStyles = ({ width }: { width: string | number }): StylesConfig => ({
  control: (provided) => ({
    ...provided,
    minHeight: 0,
    border: "none",
    outline: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    width,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0px",
  }),
  container: (provided) => ({
    ...provided,
    position: "relative",
    minWidth: "120px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  option: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "10px",
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 999,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    fontWeight: 400,
    fontSize: "12px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "0px",
    display: !state.isDisabled ? "auto" : "none",
    transform: "scale(0.8)",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    display: state.isDisabled ? "none" : "flex",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontFamily: "Geist",
    color: "#999999",
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
});

export default customStyles;
