import { ReactNode } from "react";

export type iconType =
  | "delete"
  | "edit"
  | "cancel"
  | "save"
  | "arrow"
  | "download"
  | "view"
  | "email"
  | "message"
  | "settings"
  | "check"
  | "copy"
  | "info"
  | "link"
  | "change"
  | "grid"
  | "text"
  | "chart"
  | "page";

export type item_DnD_Type = {
  id: string;
  label: string;
  id: string;
  position?: number;
  name?: string;
  required?: boolean;
  is_page?: boolean;
};

export type items_DnD_Type = Array<item_DnD_Type>;

export type DnD_Type = {
  items: items_DnD_Types;
  ItemComponent: React.FC<{ item: item_DnD_Type; id: item_DnD_Type.id }>;
  afterSortFunction: (items: items_DnD_Type) => void;
  beforeUpdateFunction: (items: items_DnD_Type) => items_DnD_Type;
  componentStyles?: (item: item_DnD_Type) => object | null;
};

export type Sortable_Type = {
  id: item_DnD_Type.id;
  item: item_DnD_Type;
  ItemComponent: React.FC<{ item: item_DnD_Type; id: item_DnD_Type.id }>;
  componentStyles: (item: item_DnD_Type) => object | null;
};

export type AddButton = {
  items: Array<{ title: string; icon: JSX.Element; onClick: function }>;
};

export type listObject = {
  header: Array<{ title: string; width: number; key: string }>;
  list: Array<{
    key: string;
    content: Array<{ element: React.JSX.Element; key: string }>;
  }>;
};

export type ListType = {
  listObject: listObject;
};

export type SwitchButton = {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
  is_icon?: boolean;
};

export type SwitchButtons = {
  buttonStates: Array<SwitchButton & any>;
  currentStates: SwitchButton;
  changeHandler: (T: SwitchButton) => void;
  underlineButtons?: boolean;
};
