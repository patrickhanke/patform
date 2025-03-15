import { DeleteModalProps } from "../types";

const deleteModalInitialValues: DeleteModalProps = {
  isOpen: false,
  confirmButtonHandler: () => {},
  header: "Bericht löschen",
};

export default deleteModalInitialValues;
