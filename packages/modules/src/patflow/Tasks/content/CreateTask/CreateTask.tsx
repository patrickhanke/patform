"use client";

import { DateSelectWithExternalState, DisplayWorker } from "@repo/ui";
import clsx from "clsx";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useImmer } from "use-immer";
import styles from "./CreateTask.module.scss";
import {
  CreateTask as CreateTaskType,
  CreateTaskProps,
  DateObjectWithNextDates,
  ErrorMessage,
  CreateTaskUpdateObject,
} from "@repo/types";
import initial_task from "./constants/initial_task";
import { Icon, ImageUploader, SlideIn, TextInput } from "@repo/ui";
import { modi_options, date_category_options } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import SelectTicket from "./components/SelectTicket";
import SelectProperty from "./components/SelectProperty";
import SelectWorker from "./components/SelectWorker";
import { getDateString, UserContext } from "@repo/provider";

const CreateTask = ({
  setRefetchTask,
  button,
  initialData,
}: CreateTaskProps) => {
  const { createData, updateData, deleteData } = useDataHandler();
  const { user, projectId } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secContent, setSecContent] = useState<
    undefined | "ticket" | "date" | "property" | "worker"
  >("date");

  const initialDate = {
    type: modi_options[0],
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
  } as DateObjectWithNextDates;

  const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
  const [task, setTask] = useImmer<CreateTaskType>(initial_task);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);

  const [date, setDate] = useState(initialDate as DateObjectWithNextDates);

  const resetState = () => {
    setTask(initial_task);
    setDate(initialDate);
    setTaskId(undefined);
    setSecContent("date");
    setIsOpen(false);
    setLoading(false);
    setErrors([]);
  };

  useEffect(() => {
    console.log("effect");
    console.log(taskId);

    if (!taskId && isOpen) {
      createData({
        className: "Task",
        updateObject: {
          title: task.title,
          created_by: {
            __type: "Pointer",
            className: "_User",
            objectId: user?.objectId,
          },
          description: task.description,
          documents: task.documents,
          state: task.state,
          assigned_staff: task.assigned_staff,
          comments: [],
          images: [],
          type: date.type.value,
          category: date.category.value,
          dates: date.next_dates,
          time: date,
          project: {
            __type: "Pointer",
            className: "Project",
            objectId: projectId,
          },
        },
        afterSaveHandler(objectId) {
          setTaskId(objectId);
        },
      });
    }
  }, [taskId, isOpen, task]);

  useEffect(() => {
    if (initialData) {
      setTask((draft) => {
        Object.keys(initialData).forEach((key) => {
          draft[key as keyof CreateTaskType] =
            initialData[key as keyof CreateTaskProps["initialData"]];
        });
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (!task.title) {
      errorArray.push({
        message: "Bitte einen Title für eine Aufgabe angeben",
        key: "task_title",
        id: "task_title",
      });
    }
    if (!task.property) {
      errorArray.push({
        message: "Bitte ein zugehöriges Objekt angeben",
        key: "taks_object",
        id: "taks_object",
      });
    }
    if (!date.next_dates || date.next_dates.length === 0) {
      errorArray.push({
        message: "Bitte das Datum vollständig ausfüllen",
        key: "taks_date",
        id: "taks_date",
      });
    }
    setErrors(errorArray);
  }, [task, date]);

  const createTask = useCallback(async () => {
    console.log(task);

    if (!taskId) {
      return;
    }

    setLoading(true);
    const updateObject: CreateTaskUpdateObject = {
      title: task.title,
      created_by: {
        __type: "Pointer",
        className: "_User",
        objectId: user?.objectId,
      },
      description: task.description,
      documents: task.documents,
      state: task.state,
      assigned_staff: task.assigned_staff,
      comments: [],
      images: task.images || [],
      type: date.type.value,
      category: date.category.value,
      dates: date.next_dates,
      time: date,
      project: {
        __type: "Pointer",
        className: "Project",
        objectId: projectId,
      },
    };

    if (task.ticket) {
      updateObject["ticket"] = {
        __type: "Pointer",
        className: "Ticket",
        objectId: task.ticket,
      };
    }

    if (task.property) {
      updateObject["property"] = {
        __type: "Pointer",
        className: "Property",
        objectId: task.property,
      };
    }

    await updateData({
      className: "Task",
      objectId: taskId,
      updateObject,
      async afterSaveHandler(objectId) {
        if (task.ticket) {
          await updateData({
            className: "Ticket",
            objectId: task.ticket,
            updateObject: {
              task: {
                __type: "Pointer",
                className: "Task",
                objectId,
              },
            },
          });
        }
        setTaskId(undefined);
      },
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
    if (setRefetchTask) {
      setRefetchTask(new Date());
    }
    resetState();
  }, [task, date, taskId]);

  useEffect(() => {
    if (!isOpen) {
      setDate(initialDate);
    }
  }, [isOpen]);

  const secondaryContent = useMemo(() => {
    if (secContent === "worker") {
      return <SelectWorker setTask={setTask} task={task} />;
    }
    if (secContent === "ticket") {
      return (
        <SelectTicket projectId={projectId} setTask={setTask} task={task} />
      );
    }
    if (secContent === "property") {
      return <SelectProperty setTask={setTask} task={task} />;
    }
    if (secContent === "date") {
      return <DateSelectWithExternalState date={date} dataHandler={setDate} />;
    }
  }, [date, setDate, secContent, task]);

  return (
    <>
      {button ? (
        button({ onClick: () => setIsOpen(true) })
      ) : (
        <button
          className={clsx(
            "full_button",
            "primary",
            "md",
            styles.create_task_button,
          )}
          onClick={() => setIsOpen(true)}
        >
          <Icon type="plus" strokeWidth={1} size={12} />
          Neue Aufgabe erstellen
        </button>
      )}
      <SlideIn
        isOpen={isOpen}
        cancel={async () => {
          setTask((draft) => {
            (draft.title = ""),
              (draft.description = ""),
              (draft.property = undefined),
              (draft.images = []);
          });
          if (taskId) {
            await deleteData({
              className: "Task",
              objectId: taskId,
            });
            setTaskId(undefined);
          }
          resetState();
        }}
        confirm={() => createTask()}
        header="Aufgabe erstellen"
        disabled={[false, errors.length > 0 || loading]}
        errors={errors}
        showSecondaryContent={isOpen}
        secondaryContent={secondaryContent}
        preventClickOutside
      >
        <div
          className={clsx(
            styles.create_task_container,
            "flexbox_column_with_gap",
          )}
        >
          <div className={styles.main_inputs_container}>
            <div className={styles.inputs_container}>
              <TextInput
                label="Aufgabe"
                id={"title"}
                onChange={(value) =>
                  setTask((draft) => {
                    draft.title = value;
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
                <label>Ticket auswählen</label>
                {task.ticket ? (
                  <div
                    className="content_element"
                    onClick={() => setSecContent("ticket")}
                  >
                    <SelectTicket
                      projectId={projectId}
                      setTask={setTask}
                      task={task}
                      showTicketOnly
                    />
                  </div>
                ) : (
                  <button
                    className="full_button sm secondary"
                    onClick={() => setSecContent("ticket")}
                  >
                    Ticket wählen
                  </button>
                )}
              </div>
              <div>
                <label>Objekt auswählen</label>
                {task.property ? (
                  <div
                    className="content_element"
                    onClick={() => setSecContent("property")}
                  >
                    <SelectProperty
                      setTask={setTask}
                      task={task}
                      showPropertyOnly
                    />
                  </div>
                ) : (
                  <button
                    className="full_button sm secondary"
                    onClick={() => setSecContent("property")}
                  >
                    Objekt wählen
                  </button>
                )}
              </div>
              <div>
                <label>Arbeiter zuweisen</label>
                {task.assigned_staff.length > 0 ? (
                  <div className={styles.worker_container}>
                    {task.assigned_staff.map((workerId) => (
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
                  setTask((draft) => {
                    draft.description = value;
                  })
                }
                type="textarea"
                width="100%"
                isTextArea
              />
              <ImageUploader
                path={`/patflow/${projectId}/tasks/${taskId}`}
                label="Bilder"
                onChange={(images: string[]) =>
                  setTask((draft) => {
                    draft.images.push(...images);
                  })
                }
                maxFileCount={10}
                previewImage={task.images}
                deleteHandler={(image: string) =>
                  setTask((draft) => {
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
    </>
  );
};

export default CreateTask;
