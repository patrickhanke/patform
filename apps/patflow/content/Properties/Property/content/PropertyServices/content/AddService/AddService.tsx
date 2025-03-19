import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { AddServiceProps } from "./types";
import { useImmer } from "use-immer";
import { useDataHandler } from "@repo/provider";
import {
  CreateService as CreateServiceType,
  DateObjectWithNextDates,
  ErrorMessage,
} from "@types";
import { SlideIn, TextInput, ImageUploader } from "@repo/ui";
import { getDateString, UserContext } from "@provider";
import {
  date_category_options,
  DateSelectWithExternalState,
  DisplayWorker,
  modi_options,
} from "content/_UI";
import SelectWorker from "./components/SelectWorker";
import clsx from "clsx";
import styles from "./AddService.module.scss";

const AddService: FC<AddServiceProps> = ({
  addService,
  setAddService,
  propertyId,
}) => {
  const { createData, updateData, deleteData } = useDataHandler();
  const { user, projectId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [secContent, setSecContent] = useState<undefined | "date" | "worker">(
    "date",
  );
  const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
  const initial_service: CreateServiceType = {
    name: "",
    description: "",
    images: [],
    is_active: true,
    assigned_staff: [],
  };

  const initial_date: DateObjectWithNextDates = {
    type: modi_options[0] as (typeof modi_options)[0],
    category: date_category_options[0],
    interval: {
      number: 1,
      unit: "days",
    },
    start_date: "",
    end_date: "",
    dates: [],
    weekday: "",
    time: "",
    next_dates: [],
  };

  const [date, setDate] = useState(initial_date as DateObjectWithNextDates);

  const [service, setService] = useImmer<CreateServiceType>(initial_service);
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);

  const resetState = () => {
    setService(initial_service);
    setServiceId(undefined);
    setSecContent("date");
    setAddService(false);
    setLoading(false);
    setErrors([]);
  };

  useEffect(() => {
    if (!serviceId && addService) {
      createData({
        className: "Service",
        updateObject: {
          title: service.name,
          created_by: {
            __type: "Pointer",
            className: "_User",
            objectId: user?.objectId,
          },
          description: service.description,
          assigned_staff: service.assigned_staff,
          comments: [],
          images: [],
          time: service,
          project: {
            __type: "Pointer",
            className: "Project",
            objectId: projectId,
          },
          property: {
            __type: "Pointer",
            className: "Property",
            objectId: propertyId,
          },
        },
        afterSaveHandler(objectId) {
          setServiceId(objectId);
        },
      });
    }
  }, [serviceId, addService, service]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (!service.name) {
      errorArray.push({
        message: "Bitte einen Title für einen Service angeben",
        key: "service_title",
        id: "service_title",
      });
    }
    setErrors(errorArray);
  }, [service]);

  const createService = useCallback(async () => {
    if (!serviceId) {
      return;
    }

    setLoading(true);
    const updateObject = {
      name: service.name,
      created_by: {
        __type: "Pointer",
        className: "_User",
        objectId: user?.objectId,
      },
      description: service.description,
      assigned_staff: service.assigned_staff,
      comments: [],
      substitutes: {},
      images: service.images || [],
      time: service,
      project: {
        __type: "Pointer",
        className: "Project",
        objectId: projectId,
      },
      property: {
        __type: "Pointer",
        className: "Property",
        objectId: propertyId,
      },
    };

    await updateData({
      className: "Service",
      objectId: serviceId,
      updateObject,
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
    resetState();
  }, [service, serviceId]);

  useEffect(() => {
    if (!addService) {
      setService(initial_service);
    }
  }, [addService]);

  const secondaryContent = useMemo(() => {
    if (secContent === "worker") {
      return (
        <SelectWorker
          setService={setService}
          service={service}
          propertyId={propertyId}
        />
      );
    }
    if (secContent === "date") {
      return <DateSelectWithExternalState date={date} dataHandler={setDate} />;
    }
  }, [service, setService, secContent]);

  return (
    <SlideIn
      isOpen={addService}
      cancel={async () => {
        setService((draft) => {
          draft.name = "";
          draft.description = "";
          draft.images = [];
        });
        if (serviceId) {
          await deleteData({
            className: "Service",
            objectId: serviceId,
          });
          setServiceId(undefined);
        }
        resetState();
      }}
      confirm={() => createService()}
      header="Service erstellen"
      disabled={[false, errors.length > 0 || loading]}
      errors={errors}
      showSecondaryContent={addService}
      secondaryContent={secondaryContent}
      preventClickOutside
    >
      <div
        className={clsx(
          styles.create_service_container,
          "flexbox_column_with_gap",
        )}
      >
        <div className={styles.main_inputs_container}>
          <div className={styles.inputs_container}>
            <TextInput
              label="Service"
              id="name"
              onChange={(value) =>
                setService((draft) => {
                  draft.name = value;
                })
              }
              errors={errors}
            />
            <div>
              <label>Datum auswählen</label>
              {date.dates.length > 0 ? (
                <div>
                  {date.dates.map((date: string) => (
                    <div
                      key={date}
                      className="content_element"
                      onClick={() => setSecContent("date")}
                    >
                      {getDateString(new Date(date)).date}
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  className="full_button sm secondary"
                  onClick={() => setSecContent("date")}
                >
                  Datum wählen
                </button>
              )}
            </div>

            <div>
              <label>Arbeiter zuweisen</label>
              {service.assigned_staff.length > 0 ? (
                <div className={styles.worker_container}>
                  {service.assigned_staff.map((workerId) => (
                    <div
                      className="content_element"
                      onClick={() => setSecContent("worker")}
                    >
                      <DisplayWorker key={workerId} workerId={workerId} />
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  className="full_button sm secondary"
                  onClick={() => setSecContent("worker")}
                >
                  Arbeiter wählen
                </button>
              )}
            </div>
            <TextInput
              label="Beschreibung"
              id="description"
              onChange={(value) =>
                setService((draft) => {
                  draft.description = value;
                })
              }
              type="textarea"
              width="100%"
              isTextArea
            />
            <ImageUploader
              path={`/patflow/${projectId}/services/${serviceId}`}
              label="Bilder"
              onChange={(images: string[]) =>
                setService((draft) => {
                  draft.images.push(...images);
                })
              }
              maxFileCount={10}
              previewImage={service.images}
              deleteHandler={(image: string) =>
                setService((draft) => {
                  const index = draft.images.findIndex(
                    (i: string) => i === image,
                  );
                  draft.images.splice(index, 1);
                })
              }
            />
          </div>
        </div>
      </div>
    </SlideIn>
  );
};

export default AddService;
