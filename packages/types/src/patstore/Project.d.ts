export type PatstoreProjectInvitation = {
	email: string;
    name: string;
    key: string;
    date: {
      iso: string;
      __type: "Date";
    };
}

export type PatstoreProject = {
  name: string;
  description: string;
  objectId: string;
  content: { label: string; value: string; icon: string }[];
  logo: {
    url: string;
    name: string;
  };
  path: string;
  modules: {
    results: Module[];
  };
  invitations: PatstoreProjectInvitation[];
  settings: {};
};