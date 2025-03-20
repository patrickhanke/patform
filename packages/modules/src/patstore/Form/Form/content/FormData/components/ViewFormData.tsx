import { IconButton, SlideIn } from "@repo/ui";
import { useState } from "react";

const ViewFormData = ({ data }) => {
  console.log(data);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <IconButton icon="view" onClick={() => setIsOpen(!isOpen)} />
      <SlideIn isOpen={isOpen} setIsOpen={setIsOpen} header="Form Daten">
        <h3>Name</h3>
        <p>{data.name}</p>
        <h3>E-Mail</h3>
        <p>{data.email}</p>
        <h3>Nachricht</h3>
        <p>{data.message}</p>
      </SlideIn>
    </div>
  );
};

export default ViewFormData;
