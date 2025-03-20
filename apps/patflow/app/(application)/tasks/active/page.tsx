import { Tasks } from "@repo/ui";
import { Suspense } from "react";

const TaksPage = () => (
  <Suspense>
    <Tasks pageState="active" />
  </Suspense>
);

export default TaksPage;
