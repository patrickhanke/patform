import { ElementSelectInterface, PersonDisplay } from "@repo/ui";
import { Worker } from "@repo/types";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { FIND_ALL_STAFF } from "@repo/provider";

const SelectUser = () => {
  const { loading, error, data } = useQuery(FIND_ALL_STAFF);
  const [selectedUsers, setSelectedUsers] = useState<Worker[]>([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users: Worker[] = data.objects.find_User.results;

  console.log(selectedUsers);

  return (
    <div>
      <ElementSelectInterface
        elements={users.map((user) => ({
          value: user.objectId,
          label: `${user.first_name} ${user.family_name}`,
          element: (
            <PersonDisplay
              person={{
                label: `${user.first_name} ${user.family_name}`,
                portrait: user.portrait,
              }}
            />
          ),
        }))}
        selectedElements={selectedUsers}
        onSelect={(elements) => setSelectedUsers(elements)}
        isSearchable
      />
    </div>
  );
};

export default SelectUser;
