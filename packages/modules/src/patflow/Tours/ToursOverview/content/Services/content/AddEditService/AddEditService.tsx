import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AddEditServiceProps, ButtonStates } from "./types";
import { Divider, Modal, SwitchButtons } from "@repo/ui";
import ServiceDaySelect from "./components/ServiceDaySelect";
import { ErrorMessage, PropertyService } from "@types";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import ServiceIntervalSelect from "./components/ServiceTimeSelect.tsx ";
import styles from "./AddEditService.module.scss";
import ServiceSettings from "./components/ServiceSettings";
import { useQuery } from "@apollo/client";
import getButtonStates from "./constants/button_states";
import { cloneDeep } from "lodash-es";
import { AddEditServiceState } from "../../types";

const AddEditService: FC<AddEditServiceProps> = ({
  title,
  addEditService,
  setAddEditService,
  propertyId,
  serviceId,
  refetch,
}) => {
  const { updateData } = useDataHandler();
  const [loading, setLoading] = useState(false);
  const [deleteService, setDeleteService] = useState(false);
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

  const [service, setService] = useState<AddEditServiceState>(addEditService);
  const button_states: ButtonStates = useMemo(
    () => getButtonStates(service.type),
    [service],
  );
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const [buttonState, setButtonsState] = useState<
    (typeof button_states)[number]
  >(button_states[0] as (typeof button_states)[number]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (buttonState.value === "day") {
      if (service.days.length === 0) {
        errorArray.push({
          message: "Bitte wählen Sie mindestens einen Tag aus",
          id: "no_day",
          key: "no_day",
        });
      }
    }

    if (buttonState.value === "interval" && service.type === "interval") {
      if (!service.interval.start_date) {
        errorArray.push({
          message: "Bitte wählen sie eine Startwoche für das Interval",
          id: "no_interval",
          key: "no_interval",
        });
      }
    }
    if (buttonState.value === "interval" && service.type === "dates") {
      if (service.dates.length === 0) {
        errorArray.push({
          message: "Bitte wählen Sie mindestens ein Datum aus",
          id: "no_days",
          key: "no_days",
        });
      }
      if (
        service.dates.filter((val, i) => service.dates.includes(val, i + 1))
          .length > 0
      ) {
        errorArray.push({
          message: "Es dürfen keine doppelten Daten existieren",
          id: "no_dublicates",
          key: "no_dublicates",
        });
      }
    }

    setErrors(errorArray);
  }, [service, buttonState]);

  const saveServiceHandler = useCallback(async () => {
    setLoading(true);
    if (data) {
      const property = data.objects.getProperty;
      console.log(property);
      const propertyServices = cloneDeep(property.services);
      const services = propertyServices || {};
      const serviceCopy: PropertyService = {
        id: service.id,
        assigned_staff: service.assigned_staff || [],
        serviceId: service.serviceId,
        active: service.active,
        days: service.days,
        type: service.type,
        dates: service.dates,
        interval: service.interval,
        settings: service.settings,
      };
      services[serviceId] = serviceCopy;

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
    setAddEditService(null);
  }, [service, data, serviceId, propertyId]);

  const deleteServiceHandler = async (serviceId: string) => {
    setLoading(true);
    if (data) {
      const property = data.objects.getProperty;
      const propertyServices = cloneDeep(property.services);
      const services = propertyServices || {};
      delete services[serviceId];
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
    setAddEditService(null);
  };

  return (
    <Modal
      header={title}
      isOpen={!!addEditService}
      cancelButtonHandler={() => setAddEditService(null)}
      confirmButtonHandler={() => {
        if (buttonState.value === "settings") {
          saveServiceHandler();
        } else {
          if (buttonState.value === "interval" && service.type === "interval") {
            setButtonsState(button_states[1]);
          }
          if (buttonState.value === "interval" && service.type === "dates") {
            setButtonsState(button_states[2]);
          }
          if (buttonState.value === "day") {
            setButtonsState(button_states[2]);
          }
        }
      }}
      confirmButtonText={
        buttonState.value === "settings" ? "Speichern" : "Weiter"
      }
      errors={errors}
      buttonDisabled={[loading, errors.length > 0 || loading]}
    >
      <div className={styles.switch_button_container}>
        <SwitchButtons
          buttonStates={button_states}
          changeHandler={setButtonsState}
          currentStates={buttonState}
          underlineButtons
        />
      </div>
      <Divider showLine={false} />
      <div className={styles.modal_content_container}>
        {buttonState.value === "day" && (
          <ServiceDaySelect
            days={service.days}
            onChange={(days) => {
              console.log(days);

              setService({ ...service, days: days });
            }}
          />
        )}
        {buttonState.value === "interval" && (
          <ServiceIntervalSelect
            service={service}
            onChange={(service) => setService(service)}
          />
        )}
        {buttonState.value === "settings" && (
          <ServiceSettings
            service={service}
            onChange={(service) => {
              setService(service);
            }}
            showDeleteButton={!!data?.objects.getProperty.services[serviceId]}
            setDelete={setDeleteService}
          />
        )}
      </div>
      {deleteService && (
        <div className={styles.delete_service_container}>
          <p>
            Möchten Sie die Leistung wirklich löschen? Dieser Vorgang kann nicht
            rückgängig gemacht werden.
          </p>
          <div className="button_container">
            <button
              className="full_button light md"
              onClick={() => {
                setDeleteService(false);
              }}
            >
              Abbrechen
            </button>
            <button
              className="full_button red md"
              onClick={() => {
                deleteServiceHandler(serviceId);
              }}
            >
              Löschen
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddEditService;
