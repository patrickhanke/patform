"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Select } from "../Select";
import { useQuery } from "@apollo/client";
import { useDataHandler } from "@repo/provider";
import { ApplicationTypes, UserTypes } from "@types";
import { FIND_ALL_STAFF, GET_SERVICE_WORKERS } from "@queries";

type WorkerSelect = {
  value: string;
  id: string;
  label: string;
  portrait?: ApplicationTypes.Image;
};

const queryHandler = (className: "Service") => {
  if (className === "Service") {
    return GET_SERVICE_WORKERS;
  }
  return GET_SERVICE_WORKERS;
};

const WorkerSelect = ({
  objectId,
  className,
}: {
  objectId: string;
  className: "Service";
}) => {
  const { updateData } = useDataHandler();
  const { data: workerData } = useQuery(FIND_ALL_STAFF);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const { data, refetch } = useQuery(queryHandler(className), {
    variables: { id: objectId },
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      setSelectedWorkers(
        data.objects.getService.workers.results.map(
          (worker: UserTypes.User) => ({
            value: worker.objectId,
            id: worker.objectId,
            portrait: worker.portrait,
            label: `${worker.first_name} ${worker.family_name}`,
          }),
        ),
      );
    },
  });

  const workerOptions = useMemo(() => {
    const workerOptionsArray: WorkerSelect[] = [];
    if (workerData) {
      workerData.objects.find_User.results.forEach((worker: UserTypes.User) => {
        if (worker.is_worker) {
          workerOptionsArray.push({
            value: worker.objectId,
            id: worker.objectId,
            label: `${worker.first_name} ${worker.family_name}`,
            portrait: worker.portrait,
          });
        }
      });
    }
    return workerOptionsArray;
  }, [workerData, data]);

  const dataHandler = useCallback(
    async (key: "add" | "clear" | "remove", id?: string) => {
      const getWorkerUpdate = (
        key: "add" | "clear" | "remove",
        id?: string,
      ) => {
        if (key === "add") {
          return {
            __op: "AddRelation",
            objects: [
              {
                __type: "Relation",
                className: "_User",
                objectId: id,
              },
            ],
          };
        }
        if (key === "remove") {
          return {
            __op: "RemoveRelation",
            objects: [
              {
                __type: "Relation",
                className: "_User",
                objectId: id,
              },
            ],
          };
        }

        return undefined;
      };

      await updateData({
        className: className,
        objectId,
        updateObject: {
          workers: getWorkerUpdate(key, id),
        },
      });
      refetch();
    },
    [],
  );

  return (
    <div>
      <Select
        label=""
        id="workers"
        value={selectedWorkers}
        options={workerOptions}
        onChange={(values, action) => {
          if (action?.action === "select-option") {
            values.forEach((element: WorkerSelect) => {
              dataHandler("add", element.id);
            });
          }
          if (action?.action === "remove-value") {
            dataHandler("remove", action.removedValue.id);
          }
          if (action?.action === "clear") {
            action.removedValues.forEach((element) => {
              dataHandler("remove", element.id);
            });
          }
        }}
        isClearable
        isMulti
      />
    </div>
  );
};

export default WorkerSelect;
