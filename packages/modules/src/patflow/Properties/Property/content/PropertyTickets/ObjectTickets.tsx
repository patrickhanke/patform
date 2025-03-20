import { Tickets } from "@repo/modules";
import React from "react";

const PropertyTickets = ({ id }: { id: string }) => {
  return (
    <>
      <Tickets pageState="open" id={id} className="Property" />
    </>
  );
};

export default PropertyTickets;
