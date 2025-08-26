import { FC, useCallback, useMemo, useState } from "react";
import { PatstoreImageUploader, SlideIn, TextInput } from "@repo/ui";
import { UserSettingsProps } from "../types";
import { ErrorMessage, PatstoreUser } from "@repo/types";
import { useAppContext, useDataHandler } from "@repo/provider";
import * as yup from "yup";

const UserSettings: FC<UserSettingsProps> = ({
  user,
  userSettings,
  setUserSettings,
  getUser,
}) => {
  const { updateData } = useDataHandler();
  const [data, setData] = useState<PatstoreUser>(user);

  const [loading, setLoading] = useState(false);

  const dataValidation = useMemo(() => {
    const errorArray: ErrorMessage[] = [];
    let schema = yup.object().shape({
      username: yup.string().required(),
      email: yup.string().email().required(),
    });
    schema.validate(data).catch((errors) => {
      console.log(errors.message);

      errorArray.push({
        message: errors.errors[0],
        id: errors.path,
        key: errors.path,
      });
    });

    return errorArray;
  }, [data]);

  const updateObject = useMemo(() => {
    let updatedata;
    if (user.email !== data.email) {
      updatedata = {
        email: data.email,
      };
    }
    if (user.username !== data.username) {
      updatedata = {
        ...updatedata,
        username: data.username,
      };
    }
    if (user?.portrait?.url !== data?.portrait?.url) {
      updatedata = {
        ...updatedata,
        portrait: data.portrait,
      };
    }

    return updatedata;
  }, [data, dataValidation]);

  const updateUserData = useCallback(async () => {
    setLoading(true);

    await updateData({
      className: "_User",
      objectId: data.objectId,
      updateObject,
      feedback: "Nutzerdaten erfolgreich aktualisiert",
    });
    await getUser();
    setLoading(false);
    setUserSettings(false);
  }, [data, updateObject]);

  return (
    <SlideIn
      header="Nutzereinstellungen"
      isOpen={userSettings}
      cancel={() => setUserSettings(false)}
      confirm={() => updateUserData()}
      preventClickOutside
      disabled={[
        loading,
        loading || !updateObject || dataValidation.length > 0,
      ]}
      errors={dataValidation}
    >
      <div>
        <TextInput
          defaultValue={data.username}
          label="Nutzername"
          id="label"
          onChange={(value) => setData({ ...data, username: value })}
        />
        <TextInput
          defaultValue={data.email}
          label="E-Mail"
          id="username"
          onChange={(value) => setData({ ...data, email: value })}
        />
        <PatstoreImageUploader
          maxFileCount={1}
          type="add"
          className="User"
          classKey="portrait"
          classId={user.objectId}
        />
      </div>
    </SlideIn>
  );
};

export default UserSettings;
