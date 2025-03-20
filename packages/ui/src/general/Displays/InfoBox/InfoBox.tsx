import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./styles.scss";

type InfoBoxComponent = {
  content?: () => React.ReactElement;
  text?: string;
};

const InfoBox = ({ content, text }: InfoBoxComponent) => (
  <div className="infobox_container">
    <span className="infobox_icon">
      <AiOutlineInfoCircle />
    </span>
    {content && content()}
    {text && text}
  </div>
);

export default InfoBox;
