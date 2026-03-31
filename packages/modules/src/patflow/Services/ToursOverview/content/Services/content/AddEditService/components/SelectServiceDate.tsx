import { months } from "@repo/provider";
import { IconButton, Select } from "@repo/ui";
import React, { FC, useEffect, useState } from "react";
import { SelectServiceDateProps } from "../types";

const SelectServiceDate: FC<SelectServiceDateProps> = ({
  date,
  onChange,
  onDelete,
}) => {
  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<(typeof months)[number]>();

  useEffect(() => {
    if (date) {
      const monthId = date.split("-")[1];
      const dayId = date.split("-")[0];
      if (dayId) {
        setDay(Number(dayId));
      }

      if (monthId) {
        setMonth(months.find((month) => month.id === Number(monthId)));
      }
    }
  }, []);

  useEffect(() => {
    if (month && day) {
      const dayValue: string = day < 10 ? `0${day}` : day.toString();
      const monthValue: string =
        month.id < 10 ? `0${month.id}` : month.id.toString();
      onChange(`${dayValue}-${monthValue}`);
    }
  }, [month, day]);

  return (
    <div key={date} className="content_element">
      <div className="horizontal_container">
        <div className="button_container">
          <input
            type="number"
            value={day}
            onChange={(e) => {
              setDay(Number(e.target.value));
            }}
            min={1}
            max={31}
          ></input>
          <Select
            options={months}
            onChange={(value) => {
              setMonth(value);
            }}
            value={month}
          />
        </div>
        <IconButton icon="delete" onClick={() => onDelete()} />
      </div>
    </div>
  );
};

export default SelectServiceDate;
