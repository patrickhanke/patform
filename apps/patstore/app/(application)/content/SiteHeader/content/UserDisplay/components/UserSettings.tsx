import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Divider, FileObject, FileUploader, SlideIn, TextInput } from "@repo/ui";
import { UserSettingsProps } from "../types";
import { ErrorMessage,PatstoreUser } from "@repo/types";
import { getImageUrl, useDataHandler } from "@repo/provider";
import * as yup from "yup";
import { Image } from "@chakra-ui/react"

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

      errorArray.push({
        message: errors.errors[0],
        id: errors.path,
        key: errors.path,
      });
    });

    return errorArray;
  }, [data]);

  const updateObject = useMemo(() => {
    let updatedata: { email?: string; username?: string; portrait?: FileObject } = {};
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

  useEffect(() => {
    setData(user);
  }, [user]);

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
          disabled
        />
        <TextInput
          defaultValue={data.email}
          label="E-Mail"
          id="username"
          onChange={(value) => setData({ ...data, email: value })}
          disabled
        />
        <label>
          Portrait
        </label>
        <Image rounded="md" src={ getImageUrl({ fileName: data.portrait?.name, width: 100, height: 100 }) } alt="Portrait" width={100} height={100} objectFit="cover" />
        <Divider showLine={false} />
        <FileUploader
          maxFileCount={1}
          type="image"
          className="_User"
          classKey="portrait"
          classId={user.objectId}
          afterUploadHandler={() => getUser()}
          inline
        />
      </div>
    </SlideIn>
  );
};

export default UserSettings;
