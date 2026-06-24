import { RecordTimeSettings } from "./Record";

export class CreateInitialTime {
  props: {
    start_date: string;
    end_date: string;
    timeSettings: RecordTimeSettings;
    holidays: string[];
  };
  return: {
    default_times: TimeObject[];
    dates: string[];
  };
}
