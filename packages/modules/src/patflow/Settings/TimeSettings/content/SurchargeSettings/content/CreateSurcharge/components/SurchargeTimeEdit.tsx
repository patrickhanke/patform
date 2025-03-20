import { DatePicker } from "@content";
import React from "react";
import { SurchargeTimeEditProps } from "../types";

const SurchargeTimeEdit: React.FC<SurchargeTimeEditProps> = ({
  surchargeChangeHandler,
  newSurcharge,
}) => {
  return (
    <>
      <div className="horizontal_container">
        <DatePicker
          label="Startzeit"
          id="start"
          defaultValue={newSurcharge.time_value.start}
          type="time"
          onChange={(startValue) =>
            surchargeChangeHandler("time_value.start", startValue)
          }
        />
      </div>
      <div className="horizontal_container">
        <DatePicker
          label="Endzeit"
          id="end"
          defaultValue={newSurcharge.time_value.end}
          type="time"
          onChange={(endValue) =>
            surchargeChangeHandler("time_value.end", endValue)
          }
        />
      </div>
      <div className="horizontal_container">
        <label htmlFor="value">Wert</label>
        <input
          type="number"
          id="value"
          defaultValue={newSurcharge.value}
          onChange={(e) =>
            surchargeChangeHandler("value", Number(e.target.value))
          }
        />
      </div>
    </>
  );
};

export default SurchargeTimeEdit;
