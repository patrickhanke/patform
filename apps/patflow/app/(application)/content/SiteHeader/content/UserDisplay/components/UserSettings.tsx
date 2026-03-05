import { FC, useCallback, useMemo, useState } from "react";
import { ImageUploader, SlideIn, TextInput } from "@repo/ui";
import { UserSettingsProps } from "../types";
import { ErrorMessage, PatstoreUser } from "@repo/types";
import { generateImagePath, useAppContext, useDataHandler } from "@repo/provider";
import * as yup from "yup";

const UserSettings: FC<UserSettingsProps> = ({
  user,
  userSettings,
  setUserSettings,
  getUser,
}) => {
  const { updateData } = useDataHandler();
  const [data, setData] = useState<PatstoreUser>(user);
  const { project } = useAppContext();

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
    if (user.portrait !== data.portrait) {
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
      className: "User",
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
        <ImageUploader
          path={generateImagePath(
            process.env.APP_NAME as string,
            project.path
          )}
          label="Profilbild"
          onChange={(value) =>
            setData({ ...data, portrait: value.length > 0 ? value[0] : "" })
          }
          maxFileCount={1}
          previewImage={data.portrait}
          crop
          preview
        />
      </div>
    </SlideIn>
  );
};

export default UserSettings;
