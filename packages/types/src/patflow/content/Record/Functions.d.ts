export class CreateInitialTime {
  props: {
    start_date: string;
    end_date: string;
    timeSettings: User["time_settings"];
    holidays: string[];
  };
  return: {
    default_times: TimeObject[];
    dates: string[];
  };
}
