import { useCallback, useEffect, useState } from "react";
import { generateGraphQLQuery, useDataHandler } from "@repo/provider";
import { useQuery } from "@apollo/client";
import form_settings from "./constants/form_settings";
import FormSettingToggle from "./components/FormSettingToggle";
import { FormClass } from "@repo/types";
import FormRecipients from "./content/FormReceipients";
import FormSettingsText from "./components/FormSettingsText";
import { FormSettingsObject } from "./types";

const FormSettings = ({ formId }: { formId: string }) => {
  const { updateData } = useDataHandler();
  const [settings, setSettings] = useState();
  const { data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "get",
      objectName: "Form",
      fields: ["settings", "objectId"],
    }),
    {
      variables: {
        id: formId,
      },
    }
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setSettings(data.objects.getForm.settings);
    }
  }, [data]);

  const updateSettingsHandler = useCallback(
    async (st: FormClass["settings"]) => {
      await updateData({
        className: "Form",
        objectId: formId,
        updateObject: {
          objectId: formId,
          settings: st,
        },
      });

      await refetch();
      setLoading(false);
    },
    [settings, data, loading]
  );

  if (!settings) {
    return null;
  }

  return (
    <div className="flex col a-st gap-sm">
      {(Object.keys(form_settings) as Array<keyof typeof form_settings>).map(
        (key) => {
          const setting = form_settings[key];

          if (key === "notification") {
            return (
              <div className="flex col a-st gap-sm w-100">
                <div key={key} className="flex row a-ce j-sb gap-sm">
                  <div className="flex col a-st">
                    <label>{setting.label}</label>
                    <p>{setting.description}</p>
                  </div>
                  <FormSettingToggle
                    settingsKey={key as keyof FormClass["settings"]}
                    loading={loading}
                    settings={settings}
                    updateSettings={updateSettingsHandler}
                  />
                </div>
                <FormRecipients
                  settingsKey={"recipients"}
                  settings={settings}
                  updateSettings={updateSettingsHandler}
                />
              </div>
            );
          } else if (key === "response") {
            return (
              <div className="flex col a-st gap-sm w-100">
                <div key={key} className="flex row a-ce j-sb gap-sm">
                  <div className="flex col a-st">
                    <label>{setting.label}</label>
                    <p>{setting.description}</p>
                  </div>
                  <FormSettingToggle
                    settingsKey={key as keyof FormClass["settings"]}
                    loading={loading}
                    settings={settings}
                    updateSettings={updateSettingsHandler}
                  />
                </div>
                <FormSettingsText
                  settings={settings}
                  updateSettings={updateSettingsHandler}
                />
              </div>
            );
          } else {
            return (
              <div key={key} className="flex row a-ce j-sb gap-sm">
                <div className="flex col a-st">
                  <label>{setting.label}</label>
                  <p>{setting.description}</p>
                </div>
                <FormSettingToggle
                  settingsKey={key as keyof FormClass["settings"]}
                  loading={loading}
                  settings={settings}
                  updateSettings={updateSettingsHandler}
                />
              </div>
            );
          }
        }
      )}
    </div>
  );
};

export default FormSettings;
