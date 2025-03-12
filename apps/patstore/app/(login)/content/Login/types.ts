import { Dispatch, SetStateAction } from "react"

export type user = {
    username: string,
    objectId: string,
    email: string
  }

  export type PasswordFormProps = {
    passwordReset: boolean,
    setPasswordReset: Dispatch<SetStateAction<boolean>>
  }