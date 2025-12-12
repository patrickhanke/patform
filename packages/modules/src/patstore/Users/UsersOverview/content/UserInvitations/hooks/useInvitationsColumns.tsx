import { useMemo } from "react";
import { ColumnDef } from "@repo/ui";
import { ApolloRefetch, PatstoreProjectInvitation } from "@repo/types";
import { getDateString } from "@repo/provider";
import DeleteInvitation from "../components/DeleteInvitation";
import SendInvitation from "../components/SendInvitationLink";

const useInvitationColumns = ({
	refetch,
	invitations,
	projectId
}: {
	refetch: ApolloRefetch;
	invitations: PatstoreProjectInvitation[];
	projectId: string;
}) => {
	const columns: ColumnDef<PatstoreProjectInvitation>[] = useMemo(
		() => [
			{
				accessorFn: (row) => <span>{row.name}</span>,
				header: () => <span>Name</span>,
				id: "name",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => row?.email,
				header: () => <span>E-Mail</span>,
				id: "username",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => row?.key,
				header: () => <span>Id</span>,
				id: "key",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => getDateString(new Date(row.date.iso)).date,
				header: () => <span>Datum</span>,
				id: "date",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<SendInvitation
						username={row.name}
						email={row.email}
						projectId={projectId}
						refetch={refetch}
					/>
				),
				header: () => <span>Einladung senden</span>,
				id: "send",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			},
			{
				accessorFn: (row) => (
					<DeleteInvitation
						id={row.key}
						username={row.name}
						email={row.email}
						projectId={projectId}
						refetch={refetch}
						invitations={invitations}
					/>
				),
				header: () => <span>Löschen</span>,
				id: "delete",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				enableSorting: false
			}
		],
		[invitations]
	);

	return columns;
};

export default useInvitationColumns;
