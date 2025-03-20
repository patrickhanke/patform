export type CreateClassProps<T> = {
  initialData: { [key: keyof T]: any };
  fields: Field[];
  text: string;
  className: string;
  refetch?: () => void;
};

export type AdminPageHeaderButton = {
  text: string;
  onClick: () => void;
  is_add_button?: boolean;
  is_reset_button?: boolean;
  color?: string;
  disabled?: boolean;
};

export type AdminPageHeaderButtons = AdminPageHeaderButton[];

type AdminPageHeaderContent = React.JSX.Element;

export type AdminPageCreateClassObject = CreateClassProps;

export type AdminPageProps = {
  title?: string;
  children: React.ReactNode;
  pageHeaderButtons?: AdminPageHeaderButtons;
  pageHeaderContent?: AdminPageHeaderContent;
  pageStates?: AdminPageState[];
  activeState?: AdminPageState;
  navOnClick?: Dispatch<SetStateAction<AdminPageState>>;
  refetch?: () => void;
  createClass?: AdminPageCreateClassObject;
  emptyContent?: boolean;
  projectId?: string;
};
