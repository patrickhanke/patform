import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SlideIn, TextInput } from "@repo/ui";
import { UserPasswordProps } from "../types";
import { ErrorMessage } from "@repo/types";
import { useDataHandler } from "@repo/provider";
import * as Yup from "yup";

const passwordschema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&_*])/,
      "Passwort muss einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten"
    )
    .required("Pflichtfeld"),
});

const UserPassword: FC<UserPasswordProps> = ({
  user,
  userPassword,
  setUserPassword,
}) => {
  const { updateData } = useDataHandler();
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [password, setPassword] = useState({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const passwordValidation = useCallback(async () => {
    const errorArray: ErrorMessage[] = [];
    if (password.password) {
      await passwordschema.validate(password).catch((errors) => {
        const errorMessage = errors.errors[0];
        errorArray.push({
          message: errorMessage,
          id: errors.path,
          key: errors.path,
        });
      });
    }

    if (errorArray.length === 0) {
      if (password.confirm_password !== password.password) {
        errorArray.push({
          message: "Passwörter stimmen nicht überein",
          id: "password_match",
          key: "password_match",
        });
      }
    }

    setErrors(errorArray);
  }, [password]);

  useEffect(() => {
    passwordValidation();
  }, [password]);

  const updateObject = useMemo(() => {
    let updatedata;
    if (passwordValidation.length > 0) {
      return;
    }

    if (password.password && password.confirm_password) {
      updatedata = {
        password: password.password,
      };
    }
    return updatedata;
  }, [passwordValidation, password]);

  const updateUserData = useCallback(async () => {
    setLoading(true);

    await updateData({
      className: "_User",
      objectId: user.objectId,
      updateObject,
    }).then(() => {
      console.log("User data updated");
    });
    setLoading(false);
    setUserPassword(false);
  }, [user, updateObject]);

  return (
    <SlideIn
      header="Passwort ändern"
      isOpen={userPassword}
      cancel={() => setUserPassword(false)}
      confirm={() => updateUserData()}
      preventClickOutside
      disabled={[loading, loading || !updateObject || errors.length > 0]}
      errors={errors}
    >
      <div>
        <form>
          <TextInput
            defaultValue={""}
            label="Passwort"
            id="password"
            type="password"
            onChange={(value) => setPassword({ ...password, password: value })}
          />
          <TextInput
            defaultValue={""}
            label="Passwort bestätigen"
            id="confirm_password"
            type="password"
            disabled={password.password.length === 0}
            onChange={(value) =>
              setPassword({ ...password, confirm_password: value })
            }
          />
        </form>
      </div>
    </SlideIn>
  );
};

export default UserPassword;
