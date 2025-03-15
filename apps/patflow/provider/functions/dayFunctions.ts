import { Day } from "@types";

export const getSaldo: (
  time: Day["time"],
  default_time: Day["default_time"],
) => number = (time, default_time) => {
  let saldo = 0;

  if (time && time.duration && default_time?.duration) {
    const timeSpan = time.duration - time.pause;
    const defaultTimeSpan = default_time.duration - default_time.pause;
    saldo = timeSpan - defaultTimeSpan;
  }

  return saldo;
};
