import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import SurchargeDaySelect from "./components/HolidayTemplateDaySelect";
import { cloneDeep, set } from "lodash-es";
import { ErrorMessage, HolidayTemplate } from "@repo/types";
import default_holiday_template from "./constants/default_holiday_template";
import { useDataHandler } from "@repo/provider";
import { CreateHolidayTemplateProps } from "./types";
import { Divider, SlideIn } from "@repo/ui";
import { UserContext } from "@repo/provider";

const CreateHolidayTemplate: React.FC<CreateHolidayTemplateProps> = ({
  templates = [],
  createTemplate,
  setCreateTemplate,
  refetch,
  holidays,
}) => {
  const [holidayTemplate, setHolidayTemplate] = useState<HolidayTemplate>(
    default_holiday_template,
  );
  const { projectId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { createData } = useDataHandler();
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

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
    templates.forEach((template) => {
      if (template.name === holidayTemplate.name) {
        errorArray.push({
          message: "Ein Template mit diesem Namen existiert bereits",
          key: "name",
          id: "name",
        });
      }
    });
    if (errors.length !== errorArray.length) setErrors(errorArray);
  }, [holidayTemplate, templates]);

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
    await createData({
      className: "Template",
      updateObject: {
        name: holidayTemplate.name,
        type: "holiday",
        holidays: holidayTemplate.holidays,
        project: {
          __type: "Pointer",
          className: "Project",
          objectId: projectId,
        },
      },
    });
    await refetch();
    setLoading(false);
    setCreateTemplate(false);
    setHolidayTemplate(default_holiday_template);
  }, [holidayTemplate]);

  return (
    <SlideIn
      isOpen={createTemplate}
      cancel={() => {
        setCreateTemplate(false);
        setHolidayTemplate(default_holiday_template);
      }}
      confirm={() => createTemplateHandler()}
      header="Neues Feiertag-Template erstellen"
      secondaryContent={selectDays}
      showSecondaryContent={true}
      errors={errors}
      disabled={[
        loading,
        loading ||
          holidayTemplate.holidays.length === 0 ||
          !holidayTemplate.name ||
          errors.length > 0,
      ]}
    >
      <div>
        <div className="surcharge_container">
          <label>Name</label>
          <input
            style={{ width: "240px" }}
            type="text"
            defaultValue={holidayTemplate.name}
            onChange={(e) =>
              holidayTemplateChangeHandler("name", e.target.value)
            }
          />
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

export default CreateHolidayTemplate;
