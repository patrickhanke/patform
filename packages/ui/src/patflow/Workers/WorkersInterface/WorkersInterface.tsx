"use client";

import { FIND_ALL_STAFF } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import styles from "./WorkersInterface.module.scss";
import DisplayWorkerInterface from "./components/DisplayWorkerInterface";
import { WorkersInterfaceComponent } from "./types";
import { Worker } from "@repo/types";

const WorkersInterface = ({
  workers,
  onChange,
  nextDate,
}: WorkersInterfaceComponent) => {
  const { data } = useQuery(FIND_ALL_STAFF);
  console.log(data);
  const users = useMemo(() => {
    if (data) {
      return data.objects.find_User.results;
    }
    return [];
  }, [data]);

  return (
    <div className={styles.worker_interface_container}>
      {users.map((worker: Worker) => (
        <DisplayWorkerInterface
          key={worker.objectId}
          worker={worker}
          isSelected={workers.includes(worker.objectId)}
          onChange={onChange}
          nextDate={nextDate}
        />
      ))}
    </div>
  );
};

export default WorkersInterface;
