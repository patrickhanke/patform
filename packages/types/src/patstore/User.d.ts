import { ApplicationTypes } from ".";

export type PatstoreUserRole = {
  objectId: string;
  name: strting;
  color: "primary" | "secondary" | "info" | "warning";
  users: {
    results: Pick<PatstoreUser, "objectId", "username">[];
  };
  roles: {
    results: PatstoreUserRole[];
  };
};

export type PatstoreUser = {
  salutation: string;
  title?: string;
  pre_title?: string;
  post_title?: string | null;
  first_name: string;
  last_name: string;
  label: string;
  objectId: string;
  email: string;
  username: string;
  is_superuser: boolean;
  type: string;
  name: string;
  role: PatstoreUserRole;
  portrait: {
    url: string;
    name: string;
  };
  password: string;
  projects: string[];
  roles: string[];
  newsletter_optin?: boolean;
  newsletter_email?: string;
  newsletter_optin_date?: string;
  newsletter_optout_date?: string | null;
  lists: string[];
  emails: 
    {
      email: string;
      lists: string[];
      settings:  {
        [key: string]: {
          optIn: string | null;
          optOut: string | null;
        }
      };
    }[];
  data: {
    [key: string]: {
      [key: string]: boolean | string;
    } & any;
  }
  settings: {
    [key: string]: {
      [key: string]: boolean | string;
    } & any;
  };
};
