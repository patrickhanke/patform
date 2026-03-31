import { ElementSelectInterface } from "@repo/ui";
import React, { FC } from "react";
import day_elements from "../constants/day_elements";
import { ServiceDaySelectProps } from "../types";

const ServiceDaySelect: FC<ServiceDaySelectProps> = ({ days, onChange }) => {
  return (
    <ElementSelectInterface
      title="Tag auswählen"
      elements={day_elements}
      onSelect={(elements) =>
        onChange(elements.map((element) => element.value))
      }
      max={7}
      selectedElements={
        days.length > 0
          ? days.map((day) => day_elements.find((el) => el.value === day))
          : []
      }
    />
  );
};

export default ServiceDaySelect;
