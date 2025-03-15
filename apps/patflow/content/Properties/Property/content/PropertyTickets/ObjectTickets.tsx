import { Tickets } from "@content";
import React from "react";

const PropertyTickets = ({ id }: { id: string }) => {
  return (
    <>
      <Tickets id={id} className="Property" />
    </>
  );
};

export default PropertyTickets;
