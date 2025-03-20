import { Tickets } from "@repo/modules";
import { Suspense } from "react";

const TicketsPage = () => {
  return (
    <Suspense>
      <Tickets pageState="open" />
    </Suspense>
  );
};

export default TicketsPage;
