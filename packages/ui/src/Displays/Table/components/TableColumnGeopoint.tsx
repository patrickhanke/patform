import { useState } from "react";
import {
  IconButton,
  Map,
  MapPlace,
  Modal,
  TableColumnGeopointProps,
} from "@repo/ui";

const TableColumnGeopoint = ({
  value,
  isEditable = false,
  onChange,
}: TableColumnGeopointProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [geopoint, setGeopoint] = useState<MapPlace | null>(value);

  return (
    <>
      <div className="table_column_textfield_container">
        {value ? value.name : "-"}

        {isEditable && (
          <>
            {!isOpen ? (
              <IconButton icon="edit" onClick={() => setIsOpen(!isOpen)} />
            ) : (
              <IconButton
                icon="check"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        cancelButtonHandler={() => setIsOpen(false)}
        confirmButtonHandler={() => {
          if (geopoint) {
            onChange(geopoint);
          }
          setIsOpen(false);
        }}
        header={"Beschreibung ändern"}
        buttonDisabled={[false, !geopoint]}
      >
        <div className={"table_column_textfield_textarea_container"}>
          <Map
            initialPlace={value}
            onChange={(geopointer) => setGeopoint(geopointer)}
            height={300}
          />
        </div>
      </Modal>
    </>
  );
};

export default TableColumnGeopoint;
