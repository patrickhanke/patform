import { FC, useMemo } from "react";
import { Select } from "@repo/ui";
import { useQuery } from "@apollo/client";
import { FIND_ALL_STAFF } from "@repo/provider";
import { Worker } from "@repo/types";
import { Image } from "@repo/types";
import { WorkerSelectWithStateProps } from "./types";
import { isArray } from "lodash-es";

type WorkerSelect = {
  value: string;
  id: string;
  label: string;
  portrait: Image;
};

const WorkerSelect: FC<WorkerSelectWithStateProps> = ({
  selectedWorkers,
  setSelectedWorkers,
  isMulti = true,
  label,
  width = 180,
}) => {
  const { data: workerData } = useQuery(FIND_ALL_STAFF);

  const workerOptions = useMemo(() => {
    const workerOptionsArray: WorkerSelect[] = [];
    if (workerData) {
      workerData.objects.find_User.results.forEach((worker: Worker) => {
        workerOptionsArray.push({
          value: worker.objectId,
          id: worker.objectId,
          label: `${worker.first_name} ${worker.family_name}`,
          portrait: worker.portrait,
        });
      });
    }
    return workerOptionsArray;
  }, [workerData]);

  console.log({ selectedWorkers });

  return (
    <div style={{ zIndex: 3 }}>
      <Select
        label={label || ""}
        id="workers"
        value={
          isArray(selectedWorkers)
            ? selectedWorkers.map((worker) =>
                workerOptions.find((option) => option.value === worker),
              )
            : selectedWorkers
              ? workerOptions.find((option) => option.value === selectedWorkers)
              : null
        }
        options={workerOptions}
        onChange={(values) => setSelectedWorkers(values)}
        isClearable
        isMulti={isMulti}
        width={width}
      />
    </div>
  );
};

export default WorkerSelect;
