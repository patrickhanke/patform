import { PropertyService } from "@types";
import { ButtonStates } from "../types";

const getButtonStates: (T: PropertyService["type"]) => ButtonStates = (
  serviceType: PropertyService["type"],
) => [
  {
    label: "Frequenz",
    value: "interval",
  },
  {
    label: "Tag",
    value: "day",
    disabled: serviceType === "dates",
  },
  {
    label: "Einstellungen",
    value: "settings",
  },
];

export default getButtonStates;
