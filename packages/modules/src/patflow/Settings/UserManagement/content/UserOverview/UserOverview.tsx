"use client";

import { useQuery } from "@apollo/client";
import React, { FC } from "react";
import useTableColumns from "./hooks/useTableColumns";
import { FIND_ALL_USERS } from "@repo/provider";
import CreateStaffMember from "./content/CreateStaffMember";
import { Table } from "@repo/ui";
import { UserOverviewProps } from "./types";

const UserOverview: FC<UserOverviewProps> = ({ isOpen, setIsOpen }) => {
	const { data, refetch } = useQuery(FIND_ALL_USERS, {
		notifyOnNetworkStatusChange: true
	});

	const columns = useTableColumns({ refetch });

	return (
		<>
			<div className="content_element no_padding">
				<Table
					columns={columns}
					data={data?.objects?.find_User?.results || []}
				/>
			</div>
			<CreateStaffMember
				workers={data?.objects?.find_User?.results || []}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				refetch={refetch}
			/>
		</>
	);
};

export default UserOverview;
