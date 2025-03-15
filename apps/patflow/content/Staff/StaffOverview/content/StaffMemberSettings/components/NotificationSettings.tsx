import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  generateGraphQLQuery,
  NotificationSettings as NST,
  useDataHandler,
} from "@repo/provider";
import { useQuery } from "@apollo/client";
import { Form } from "@repo/ui";
import notification_settings_labels from "../constants/notification_settings_labels";
import { ToggleField } from "../../../../../../../../packages/ui/src/Displays/FormikRender/types";

interface NotificationSettingsProps {
  userId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  userId,
}) => {
  const [settings, setSettings] = useState<NST | undefined>(undefined);
  const { updateData } = useDataHandler();
  const { refetch } = useQuery(
    generateGraphQLQuery({
      type: "get",
      objectName: "_User",
      fields: ["objectId", "notification_settings"],
    }),
    {
      variables: { id: userId },
      onCompleted: (data) => {
        const user = data.objects.get_User;
        setSettings(user.notification_settings);
      },
    },
  );

  const fields = useMemo(() => {
    const settingsArray: ToggleField[] = [];
    if (settings) {
      for (const [key, value] of Object.entries(settings)) {
        console.log(value);

        settingsArray.push({
          type: "toggle",
          id: key,
          name: key,
          initialValue: value,
          label:
            notification_settings_labels[
              key as keyof typeof notification_settings_labels
            ],
          value: value,
        });
      }
    }
    return settingsArray;
  }, [settings]);

  console.log(settings);
  console.log(fields);

  return (
    <div>
      <h4>Nachrichteneinstellungen</h4>
      <Form
        fields={fields}
        formSubmitHandler={async (values) => {
          await updateData({
            className: "_User",
            objectId: userId,
            updateObject: {
              notification_settings: values,
            },
          });
          refetch();
        }}
        isHorizontal
        valueReturnFunction={(values) => {
          console.log(values);
        }}
      />
      <ul>
        {/* {settings.map(setting => (
                    <li key={setting.id}>
                        {setting.type}: {setting.enabled ? 'Enabled' : 'Disabled'}
                    </li>
                ))} */}
      </ul>
    </div>
  );
};

export default NotificationSettings;
