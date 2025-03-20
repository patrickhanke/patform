import { useMemo } from "react";
import { Select } from "@repo/ui";
import { useQuery } from "@apollo/client";
import { FIND_ALL_PROPERTY } from "@repo/provider";
import { Property, PropertySelect } from "@repo/types";

const ObjectSelectWithState = ({
  selectedObject,
  setSelectedObject,
  label,
  disabled = false,
}: {
  selectedObject?: PropertySelect;
  setSelectedObject: (W: PropertySelect) => void;
  label?: string;
  disabled?: boolean;
}) => {
  const { data: objectData } = useQuery(FIND_ALL_PROPERTY);

  const objectOptions = useMemo(() => {
    const objectOptionsArray: PropertySelect[] = [];
    if (objectData) {
      objectData.objects.findProperty.results.forEach((object: Property) => {
        if (object) {
          objectOptionsArray.push({
            value: object.objectId,
            id: object.objectId,
            label: object.name,
          });
        }
      });
    }
    return objectOptionsArray;
  }, [objectData]);

  return (
    <div>
      <Select
        label={label || ""}
        id="objects"
        value={selectedObject}
        options={objectOptions}
        onChange={(values) => setSelectedObject(values)}
        width={"100%"}
        isDisabled={disabled}
        menuPosition="absolute"
      />
    </div>
  );
};

export default ObjectSelectWithState;
