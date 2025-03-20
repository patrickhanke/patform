import { Tickets } from "@repo/ui";
import { Suspense } from "react";

const TicketsPage = () => {
  return (
    <Suspense>
      <Tickets pageState="open" />
    </Suspense>
  );
};

export default TicketsPage;
