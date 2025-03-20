import { Tickets } from "@repo/modules";
import { Suspense } from "react";

const TicketsPage = () => {
  return (
    <Suspense>
      <Tickets pageState="closed" />
    </Suspense>
  );
};

export default TicketsPage;
