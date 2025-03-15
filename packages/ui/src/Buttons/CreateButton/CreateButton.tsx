import { BsPlusCircleDotted } from "react-icons/bs";
import "./styles.scss";

type CreateButtonType = {
  onClick: (t?: any) => void;
  text: string;
  size: "small" | "medium";
  disabled?: boolean;
};

const CreateButton = ({ onClick, text, size, disabled }: CreateButtonType) => {
  return (
    <button
      type="button"
      className={"create_button"}
      data-size={size}
      onClick={() => onClick()}
      disabled={disabled}
    >
      <div className={"create_button_content"}>
        <BsPlusCircleDotted />
        {text}
      </div>
    </button>
  );
};

export default CreateButton;
