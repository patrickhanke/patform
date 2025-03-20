import { useQuery } from "@apollo/client";
import { FIND_ALL_PROPERTY } from "@queries";
import { ElementSelectInterface } from "@repo/ui";
import { Property, Task } from "@repo/types";
import React, { FC, useMemo } from "react";
import { PropertyOptions, SelectPropertyProps } from "../types";
import styles from "../CreateTask.module.scss";

export const DisplayProperty = ({ title }: { title: string }) => (
  <div className={styles.property_container}>
    <h3>{title}</h3>
  </div>
);

const SelectProperty: FC<SelectPropertyProps> = ({
  setTask,
  task,
  showPropertyOnly = false,
}) => {
  const { data: objectData } = useQuery(FIND_ALL_PROPERTY);

  const elements = useMemo(() => {
    const objectOptionsArray: PropertyOptions[] = [];
    if (objectData) {
      objectData.objects.findProperty.results.forEach((object: Property) => {
        if (object) {
          objectOptionsArray.push({
            value: object.objectId,
            id: object.objectId,
            label: object.name,
            element: <DisplayProperty title={object.name} />,
          });
        }
      });
    }
    objectOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

    return objectOptionsArray;
  }, [objectData]);

  if (showPropertyOnly) {
    const property = elements.find((el) => el.value === task.property);
    if (!property) {
      return null;
    }
    return <DisplayProperty title={property?.label} />;
  }
  return (
    <ElementSelectInterface
      title="Objekt auswählen"
      elements={elements}
      isSearchable
      selectedElements={elements.filter((el) => el.value === task.property)}
      onSelect={(values) => {
        if (values.length > 0) {
          setTask((task: Task) => ({
            ...task,
            property: values[0].value,
          }));
        } else if (values.length === 0 && task.property) {
          setTask((task: Task) => ({
            ...task,
            property: undefined,
          }));
        }
      }}
    />
  );
};

export default SelectProperty;
