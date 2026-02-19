import { Tasks } from "@repo/modules";
import { Suspense } from "react";

const TaksPage = () => (
  <Suspense>
    <Tasks key="active" pageState="active" />
  </Suspense>
);

export default TaksPage;
