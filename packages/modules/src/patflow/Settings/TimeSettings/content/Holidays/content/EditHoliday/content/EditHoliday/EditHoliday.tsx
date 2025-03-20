import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Divider, SlideIn } from "@repo/ui";
import SurchargeDaySelect from "./components/HolidayTemplateDaySelect";
import { cloneDeep, set } from "lodash-es";
import { ErrorMessage, Holiday, HolidayTemplate } from "@repo/types";
import {
  generateGraphQLQuery,
  useDataHandler,
} from "@repo/provider";
import { useQuery } from "@apollo/client";
import { EditHolidayProps } from "./types";
import { UserContext } from "@repo/provider";

const EditHoliday: React.FC<EditHolidayProps> = ({
  template,
  editTemplate,
  setEditTemplate,
  refetch,
}) => {
  const [holidayTemplate, setHolidayTemplate] =
    useState<HolidayTemplate>(template);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const { projectId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { updateData } = useDataHandler();
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const { data } = useQuery(
    generateGraphQLQuery({
      type: "get",
      objectName: "Project",
      fields: ["objectId", "time_settings"],
    }),
    { variables: { id: projectId } },
  );

  useEffect(() => {
    if (data) {
      setHolidays(data.objects.getProject.time_settings.holidays);
    }
  }, [data]);

  const holidayTemplateChangeHandler = useCallback(
    (path: string, value: HolidayTemplate[keyof HolidayTemplate]) => {
      const holidayTemplateCopy: HolidayTemplate = cloneDeep(holidayTemplate);
      set(holidayTemplateCopy, path, value);
      setHolidayTemplate(holidayTemplateCopy);
    },
    [holidayTemplate],
  );

  useEffect(() => {
    const errorArray: ErrorMessage[] = [];
    if (!holidayTemplate.name) {
      errorArray.push({
        message: "Bitte einen Namen angeben",
        key: "name",
        id: "name",
      });
    }
    if (holidayTemplate.holidays.length === 0) {
      errorArray.push({
        message: "Bitte mindestens einen Tag auswählen",
        key: "day",
        id: "day",
      });
    }
    if (errors.length !== errorArray.length) setErrors(errorArray);
  }, [holidayTemplate]);

  const selectDays = useMemo(() => {
    return (
      <SurchargeDaySelect
        holidays={holidays}
        holidayTemplate={holidayTemplate}
        holidayTemplateChangeHandler={holidayTemplateChangeHandler}
      />
    );
  }, [holidayTemplate, holidays]);

  const findDay = (day: string) =>
    holidays.find((dayToFind) => dayToFind.objectId === day);

  const createTemplateHandler = useCallback(async () => {
    setLoading(true);
    await updateData({
      className: "Template",
      objectId: template.objectId,
      updateObject: {
        holidays: holidayTemplate.holidays,
      },
    });
    await refetch();
    setLoading(false);
    setEditTemplate(false);
  }, [holidayTemplate]);

  return (
    <SlideIn
      isOpen={editTemplate}
      cancel={() => {
        setEditTemplate(false);
      }}
      confirm={() => createTemplateHandler()}
      header="Neues Feiertag-Template erstellen"
      secondaryContent={selectDays}
      errors={errors}
      disabled={[
        loading,
        loading || !holidayTemplate.name || errors.length > 0,
      ]}
    >
      <div>
        <div className="surcharge_container">
          <label>Name</label>
          <input
            disabled
            style={{ width: "240px" }}
            type="text"
            defaultValue={holidayTemplate.name}
            onChange={(e) =>
              holidayTemplateChangeHandler("name", e.target.value)
            }
          />
          <p>Name kann nicht geändert werden</p>
        </div>

        <div className="create_surcharge_container">
          <Divider text="Ausgewählte Tage" />
          {holidayTemplate.holidays.length > 0 ? (
            holidayTemplate.holidays.map((id) => (
              <p key={id}> - {findDay(id)?.name || id}</p>
            ))
          ) : (
            <p>Noch keine Tage ausgewählt</p>
          )}
        </div>
      </div>
    </SlideIn>
  );
};

export default EditHoliday;
