import { WorkerTypes } from "@types";

export type DisplayWorkersProps = {
  workerId: WorkerTypes.Worker["objectId"];
  nextDate?: string;
  showState?: boolean;
  showAvailability?: boolean;
  onlyImage?: boolean;
};
