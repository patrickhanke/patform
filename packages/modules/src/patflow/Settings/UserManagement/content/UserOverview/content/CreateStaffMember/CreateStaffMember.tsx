import React, { useState, useEffect, FC, useContext } from "react";
import { useImmer } from "use-immer";
import { useQuery } from "@apollo/client";
import { FIND_ALL_ROLES } from "@repo/provider";
import { generateColor, useDataHandler } from "@repo/provider";
import { ErrorMessage, Worker } from "@repo/types";
import { SlideIn } from "@repo/ui";
import { CreateStaffMemberProps } from "./types";
import EditStaffData from "./components/EditStaffData";
import EditStaffSecondaryData from "./components/EditStaffSecondaryData";
import { formatISO } from "date-fns";
import { CreateUser } from "@repo/types";
import { UserContext } from "@repo/provider";

const CreateStaffMember: FC<CreateStaffMemberProps> = ({
  workers = [],
  setIsOpen,
  isOpen,
  refetch,
}) => {
  const { projectId } = useContext(UserContext);
  const { createData, updateData, loading: dataLoading } = useDataHandler();
  const [loading, setLoading] = useState(dataLoading);
  const { data: roleData } = useQuery(FIND_ALL_ROLES);
  const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
  const [worker, setWorker] = useImmer<CreateUser>({
    family_name: "",
    first_name: "",
    portrait: "",
    email: "",
    role: "",
    password: "",
    repeat_password: "",
    color: generateColor(),
  });

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    workers.forEach((existingWorker: Worker) => {
      if (
        existingWorker.family_name === worker.family_name &&
        existingWorker.first_name === worker.first_name
      ) {
        errorArray.push({
          message: "Dieser Name existiert bereits",
          key: "family_name_group",
          id: "family_name",
        });
      }
    });
    if (!worker.first_name) {
      errorArray.push({
        message: "Bitte einen Vornamen angeben",
        key: "first_name",
        id: "first_name",
      });
    }
    if (!worker.family_name) {
      errorArray.push({
        message: "Bitte einen Nachnamen angeben",
        key: "family_name",
        id: "family_name",
      });
    }
    if (!worker.role) {
      errorArray.push({
        message: "Bitte eine Rolle auswählen",
        key: "role",
        id: "role",
      });
    }
    if (!worker.email) {
      errorArray.push({
        message: "Bitte eine E-Mail Adresse angeben",
        key: "email",
        id: "email",
      });
    }
    if (!worker.password) {
      errorArray.push({
        message: "Bitte ein Passwort angeben",
        key: "password",
        id: "password",
      });
    }
    if (!worker.repeat_password) {
      errorArray.push({
        message: "Bitte das Passwort wiederholen",
        key: "repeat_password",
        id: "repeat_password",
      });
    }
    if (worker.repeat_password && worker.repeat_password !== worker.password) {
      errorArray.push({
        message: "Die beiden Passwörter stimmen nicht überein",
        key: "repeat_password",
        id: "repeat_password",
      });
    }

    setErrors(errorArray);
  }, [worker]);

  const createWorkerHandler = async (worker: CreateUser, number: number) => {
    setLoading(true);
    await createData({
      className: "_User",
      updateObject: {
        username: worker.email,
        family_name: worker.family_name,
        first_name: worker.first_name,
        role: {
          __type: "Pointer",
          className: "_Role",
          objectId: worker.role,
        },
        project: {
          __type: "Pointer",
          className: "Project",
          objectId: projectId,
        },
        email: worker.email,
        number: number,
        password: worker.password,
        portrait: worker.portrait,
        settings: {
          start_date: formatISO(new Date()),
          vacation_days: 30,
          color: generateColor(),
        },
      },
      afterSaveHandler: async (objectId) => {
        await updateData({
          className: "_Role",
          objectId: worker.role,
          updateObject: {
            users: {
              __op: "AddRelation",
              objects: [
                {
                  __type: "Pointer",
                  className: "_User",
                  objectId: objectId,
                },
              ],
            },
          },
        });
        refetch();
      },
    });
    setLoading(false);

    setIsOpen(false);
  };

  return (
    <SlideIn
      header="Neuen Mitarbeiter anlegen"
      isOpen={isOpen}
      cancel={() => setIsOpen(false)}
      confirm={() => createWorkerHandler(worker, workers.length + 1)}
      disabled={[loading, errors.length > 0 || loading]}
      secondaryContent={
        <EditStaffSecondaryData
          staffMember={worker}
          setStaffMember={setWorker}
        />
      }
      showSecondaryContent={true}
    >
      <EditStaffData
        staffMember={worker}
        setStaffMember={setWorker}
        errors={errors}
        roles={roleData && roleData.objects.find_Role.results}
      />
    </SlideIn>
  );
};

export default CreateStaffMember;
