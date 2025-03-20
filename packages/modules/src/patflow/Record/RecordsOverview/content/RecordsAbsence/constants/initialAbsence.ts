import { Absence } from "@repo/types";

const initialAbsence: Absence = {
  id: "",
  user: "",
  start_date: "",
  end_date: "",
  state: "created",
  comment: "",
  type: "" as Absence["type"],
};

export default initialAbsence;
