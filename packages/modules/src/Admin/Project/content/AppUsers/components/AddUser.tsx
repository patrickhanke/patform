import React, { useState, FC, useMemo } from "react";
import { Divider, ElementSelectInterface, TextInput } from "@repo/ui";
import { useQuery } from "@apollo/client";
import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { AddUserProps, UserObject } from "../types";
import { PatstoreUser } from "@repo/types";

const AddUser: FC<AddUserProps> = ({ user, setUser, projectId }) => {
  const [searchValue, setSearchValue] = useState("");
  const { loading, data, refetch } = useQuery(
    generateGraphQLQuery({
      type: "find",
      objectName: "_User",
      fields: ["objectId", "username", "email", "label", "projects"],
    }),
    {
      variables: {
        params: paramsHandler({
          filters: [
            {
              key: "username",
              value: searchValue,
              operator: "_regex",
              id: "username",
            },
            {
              key: "projects",
              value: projectId,
              operator: "_nin",
              id: "projects",
            },
          ],
        }),
      },
      notifyOnNetworkStatusChange: true,
      skip: !searchValue,
    }
  );

  console.log(data);

  const elements: UserObject[] = useMemo(() => {
    if (data) {
      return data.objects.find_User.results.map((user: PatstoreUser) => {
        return {
          label: user.label,
          value: user.objectId,
          email: user.username,
          username: user.email,
          projects: user.projects,
        } as UserObject;
      });
    }

    return [];
  }, [data]);

  return (
    <div>
      <TextInput
        id="search"
        onChange={(value) => setSearchValue(value)}
        placeholder="Suche nach E-Mail"
      />
      <Divider size="small" />

      <ElementSelectInterface
        elements={elements}
        onSelect={(value: UserObject[]) => {
          console.log(value);
          if (value[0]) {
            setUser(value[0]);
          }
        }}
        selectedElements={user ? [user] : []}
      />
    </div>
  );
};

export default AddUser;
