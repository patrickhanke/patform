import { ElementSelectInterface, PersonDisplay } from "@repo/ui";
import { Worker } from "@repo/types";
import React, { FC, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { FIND_ALL_STAFF } from "@repo/provider";
import { SelectUserProps } from "../types";

const SelectUser: FC<SelectUserProps> = ({ selectedUser, setSelectedUser }) => {
  const { loading, error, data } = useQuery(FIND_ALL_STAFF);

  const elements = useMemo(() => {
    const users: Worker[] = data?.objects.find_User.results;

    if (users) {
      return users.map((user: Worker) => ({
        value: user.objectId,
        label: `${user.first_name} ${user.last_name}`,
        user: user,
        element: (
          <PersonDisplay
            person={{
              label: `${user.first_name} ${user.last_name}`,
              portrait: user.portrait,
            }}
          />
        ),
      }));
    }
    return [];
  }, [data, selectedUser]);

  const selectedElement = useMemo(() => {
    if (selectedUser && elements) {
      const el = elements.find(
        (element) => element.value === selectedUser.objectId,
      );
      return [el];
    }
    return [];
  }, [selectedUser, elements]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ElementSelectInterface
        elements={elements}
        selectedElements={selectedElement}
        onSelect={(elements) => setSelectedUser(elements)}
        isSearchable
      />
    </div>
  );
};

export default SelectUser;
