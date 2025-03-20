import { DeleteModalProps } from "../types";

const deleteModalInitialValues: DeleteModalProps = {
  isOpen: false,
  confirmButtonHandler: () => {},
  header: "Person löschen",
};

export default deleteModalInitialValues;
