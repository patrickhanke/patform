import { DeleteModalProps } from "../types";

const deleteModalInitialValues: DeleteModalProps = {
    images: [],
    isOpen: false,
    confirmButtonHandler: () => {},
    header: 'Bilder löschen',
}

export default deleteModalInitialValues;