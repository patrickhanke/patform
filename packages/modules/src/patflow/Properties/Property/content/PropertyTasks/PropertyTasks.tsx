import { Tasks } from "@repo/ui";
import React, { Suspense } from "react";

const PropertyTasks = ({ objectId }: { objectId: string }) => {
  return (
    <Suspense>
      <Tasks pageState="active" id={objectId} className={"Property"} />
    </Suspense>
  );
};

export default PropertyTasks;
