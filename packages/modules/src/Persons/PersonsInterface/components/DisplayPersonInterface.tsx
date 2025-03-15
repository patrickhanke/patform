import { DisplayPersonInterfaceComponent } from "../types";
import { getImageUrl } from "@repo/provider";
import "../styles.scss";

const DisplayPersonsInterface = ({
  person,
  isSelected,
  onChange,
}: DisplayPersonInterfaceComponent) => {
  return (
    <button
      className="display_person_interface_container"
      data-isselected={isSelected}
      // disabled={personAbsence.isAbsent}
      // data-isabsent={personAbsence.isAbsent}
      onClick={() => onChange(isSelected ? "remove" : "add", person.objectId)}
    >
      <div className="display_person_interface_container_pers_data">
        <div className="display_person_interface_image_container">
          {person.portrait ? (
            <img
              src={getImageUrl({
                filePath: person.portrait,
                height: 60,
                width: 60,
              })}
              alt={`${person.label}`}
              width={"24px"}
              height={"24px"}
            />
          ) : null}
        </div>
        <h4>{`${person.label}`}</h4>
      </div>
    </button>
  );
};

export default DisplayPersonsInterface;
