export type UserMenuProps = {
  user: PatstoreUser;
  setUserMenu: Dispatch<SetStateAction<boolean>>;
  setUserSettings: Dispatch<SetStateAction<boolean>>;
  setUserPassword: Dispatch<SetStateAction<boolean>>;
  setSelectProject: Dispatch<SetStateAction<boolean>>;
};
