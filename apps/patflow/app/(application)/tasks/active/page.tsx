import { Tasks } from "@content";
import { Suspense } from "react";

const TaksPage = () => (
  <Suspense>
    <Tasks pageState="active" />
  </Suspense>
);

export default TaksPage;
