import React, { FC, useCallback, useMemo, useState } from "react";
import { TourCellProps } from "../types";
import styles from "../Tour.module.scss";
import { useDataHandler } from "@repo/provider";
import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { cloneDeep, set } from "lodash-es";
import { IconButton } from "@repo/ui";
import { DisplayWorker, TeamAssignment, WorkersInterface } from "@repo/ui";
import renderCurrentService from "../functions/renderCurrentService";
import useTourStore from "../../../hooks/useTourStore";
import { PropertyService, Worker } from "@repo/types";

const TourCell: FC<TourCellProps> = ({
  services,
  id,
  serviceName,
  propertyId,
  propertyName,
  refetch,
  year,
}) => {
  const { updateData } = useDataHandler();
  const [loading, setLoading] = useState(false);
  const week = useTourStore((state) => state.week);
  const worker = useTourStore((state) => state.worker);
  const { data } = useQuery(
    generateGraphQLQuery({
      objectName: "Property",
      type: "get",
      fields: ["services", "objectId"],
    }),
    {
      variables: {
        id: propertyId,
      },
    },
  );

  const service: PropertyService | undefined = services[id];
  const [workers, setWorkers] = useState<string[]>([]);
  const activeWeek = useMemo(
    () =>
      week.value === 0
        ? true
        : renderCurrentService({ service, week: week.value, year }),
    [week, year],
  );

  const addServiceToUserHandler = useCallback(async () => {
    setLoading(true);
    if (data) {
      const property = data.objects.getProperty;
      const propertyServices = cloneDeep(property.services);
      const services = propertyServices || {};
      set(services, `${id}.assigned_staff`, [worker]);
      // services[id] = service;
      console.log(services);
      await updateData({
        className: "Property",
        objectId: propertyId,
        updateObject: {
          objectId: propertyId,
          services: services,
        },
        onError: () => {
          setLoading(false);
        },
      });
    }
    await refetch();
    setLoading(false);
  }, [service]);

  const removeServiceFromUserHandler = useCallback(async () => {
    setLoading(true);
    if (data) {
      const property = data.objects.getProperty;
      const propertyServices = cloneDeep(property.services);
      const services = propertyServices || {};
      set(services, `${id}.assigned_staff`, []);
      // services[id] = service;
      console.log(services);
      await updateData({
        className: "Property",
        objectId: propertyId,
        updateObject: {
          objectId: propertyId,
          services: services,
        },
        onError: () => {
          setLoading(false);
        },
      });
    }
    await refetch();
    setLoading(false);
  }, [service]);

  if (!service) {
    return <div className={styles.no_service} />;
  }

  if (!activeWeek) {
    return <div className={styles.no_service} />;
  }

  if (
    worker &&
    service.assigned_staff.includes(worker) &&
    service.substitutes
  ) {
    return (
      <div className="flex row a-ct">
        <div
          style={{ cursor: "pointer" }}
          onClick={removeServiceFromUserHandler}
        >
          <DisplayWorker workerId={service.assigned_staff[0]} onlyImage />
        </div>
        /
        <div>
          <TeamAssignment
            workers={workers || []}
            onChange={async (values) => {
              console.log(values);

              setWorkers(values.map((worker) => worker.value));

              // const property = data.objects.getProperty;
              // const propertyServices = cloneDeep(property.services);
              // const services = propertyServices || {};
              // const staff = values.map((value: Worker) => value.objectId);
              // set(services, `${id}.subsititutes.${week.value}`, [] );
              // // services[id] = service;
              // console.log(services);
              // await updateData({
              //     className: 'Property',
              //     objectId: propertyId,
              //     updateObject: {
              //         objectId: propertyId,
              //         services: services
              //     },
              //     onError: () => {
              //         setLoading(false);
              //     }
              // })
            }}
            showAsButton
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <IconButton
        icon="plus"
        color="green"
        onClick={addServiceToUserHandler}
        disabled={loading}
      />
    </div>
  );
};

export default TourCell;
