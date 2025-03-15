export type TableColumnEditFieldProps = {
  objectId: string;
  className: string;
};

export type TableColumnEditFieldComponent = (
  params: TableColumnEditFieldProps
) => React.JSX.Element;
