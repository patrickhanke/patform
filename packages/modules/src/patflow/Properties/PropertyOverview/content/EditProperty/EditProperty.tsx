"use client";

import { useCallback, useState } from "react";
import { IconButton, Modal } from "@repo/ui";
import { ApolloRefetch, useDataHandler, useFindData } from "@repo/provider";

const EditProperty = ({
	propertyId,
	refetchProperties,
	refetch
}: {
	propertyId: string;
	refetchProperties: ApolloRefetch;
	refetch: ApolloRefetch;
}) => {
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { deleteData } = useDataHandler();

	const { loading: tasksLoading, data: tasksData } = useFindData({
		objectName: "Task",
		fields: ["objectId", "title"],
		filters: [
			{
				id: "property",
				key: "property",
				operator: "have",
				value: { id: { equalTo: propertyId } }
			}
		],
		skipQuery: !deleteModalOpen
	});

	const { loading: ticketsLoading, data: ticketsData } = useFindData({
		objectName: "Ticket",
		fields: ["objectId", "title"],
		filters: [
			{
				id: "property",
				key: "property",
				operator: "have",
				value: { id: { equalTo: propertyId } }
			}
		],
		skipQuery: !deleteModalOpen
	});

	const deleteHandler = useCallback(async () => {
		setLoading(true);
		const tasksDeletePromises = tasksData?.map((task) =>
			deleteData({
				className: "Task",
				objectId: task.objectId
			})
		);
		const ticketsDeletePromises = ticketsData?.map((ticket) =>
			deleteData({
				className: "Ticket",
				objectId: ticket.objectId
			})
		);
		await Promise.all(tasksDeletePromises);
		await Promise.all(ticketsDeletePromises);
		await deleteData({
			className: "Property",
			objectId: propertyId
		});
		await refetch();
		setLoading(false);
		setDeleteModalOpen(false);
		refetchProperties();
	}, [tasksData, ticketsData, deleteData, refetchProperties, refetch]);

	return (
		<>
			<div className="button-container">
				<IconButton
					icon="link"
					isLink
					link={`/properties/${propertyId}`}
				/>
				<IconButton
					icon="delete"
					onClick={() => setDeleteModalOpen(true)}
				/>
			</div>
			<Modal
				isOpen={deleteModalOpen}
				cancelButtonHandler={() => setDeleteModalOpen(false)}
				header="Objekt löschen"
				confirmButtonText="Löschen"
				cancelButtonText="Abbrechen"
				loading={tasksLoading || ticketsLoading || loading}
				confirmButtonHandler={deleteHandler}
			>
				<div>
					<p>
						Sind Sie sicher, dass Sie dieses Objekt löschen möchten?
					</p>
					<p>
						{tasksData?.length} Aufgaben und {ticketsData?.length}{" "}
						Tickets werden gelöscht.
					</p>
				</div>
			</Modal>
		</>
	);
};

export default EditProperty;
