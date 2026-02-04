import { useDataHandler, useGetData } from "@repo/provider";
import { Loader, TextInput } from "@repo/ui";
import React, { useState } from "react";

const TallyName = ({ tallyId }: { tallyId: string }) => {
  const { data, refetch } = useGetData({
    objectName: "Tally",
    fields: ["objectId", "name"],
    id: tallyId
  });

  const { updateData } = useDataHandler();
  const [titleEdit, setTitleEdit] = useState(false);

  const titlenDataHandler = async (value: string) => {
    await updateData({
      className: "Tally",
      objectId: tallyId,
      updateObject: {
        name: value,
      },
    });
    refetch();
  };
  if (data)
    return titleEdit ? (
      <div>
        <TextInput
          id="tally_name"
          label=""
          defaultValue={data.name}
          onChange={(value) => titlenDataHandler(value)}
          onBlur={() => setTitleEdit(false)}
        />
      </div>
    ) : (
      <div onDoubleClick={() => setTitleEdit(true)}>
        <h2>{data.name}</h2>
      </div>
    );

  return <Loader height="18px" width="240px" />;
};

export default TallyName;
