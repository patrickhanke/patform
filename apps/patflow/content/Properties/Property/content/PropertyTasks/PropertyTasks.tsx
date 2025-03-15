import { Tasks } from "@content";
import React, { Suspense } from "react";

const PropertyTasks = ({ objectId }: { objectId: string }) => {
  return (
    <Suspense>
      <Tasks pageState="active" id={objectId} className={"Property"} />
    </Suspense>
  );
};

export default PropertyTasks;
