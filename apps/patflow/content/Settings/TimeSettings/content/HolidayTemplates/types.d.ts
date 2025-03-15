import { ProjectTypes } from "@types";
import React from "react";

export type HolidaysProps = {
  projectId: string;
  createHolidayTemplate: boolean;
  setCreateHolidayTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  holidays: Holiday[];
};

export type HolidayChangeHandler = (id: string, value: boolean) => void;

export type HolidayElementProps = {
  holiday: ProjectTypes.Holiday;
  index: number;
  holidayChangeHandler: HolidayChangeHandler;
};
