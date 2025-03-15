export type WorkerSelectWithStateProps = {
  selectedWorkers: string[] | string | null;
  setSelectedWorkers: (W: WorkerSelect[] | WorkerSelect) => void;
  isMulti?: boolean;
  label?: string;
  width?: string | number;
};
