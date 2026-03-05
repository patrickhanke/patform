"use client";

import {
	CreateTicket as CreateTickeType,
	ErrorMessage,
	TicketUpdateObject
} from "@repo/types";
import clsx from "clsx";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react";
import { useImmer } from "use-immer";
import { Plus } from "lucide-react";
import initial_ticket from "./constants/initial_ticket";
import { ImageUploader, Modal } from "@repo/ui";
import { ObjectSelectWithState } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { UserContext } from "@repo/provider";
import "./styles.scss";

const CreateTicket = ({
	setRefetchTicket
}: {
	setRefetchTicket: Dispatch<SetStateAction<Date | undefined>>;
}) => {
	const { createData } = useDataHandler();
	const { user } = useContext(UserContext);
	const [isOpen, setIsOpen] = useState(false);

	const [errors, setErrors] = useState([] as unknown as ErrorMessage[]);
	const [ticket, setTicket] = useImmer<CreateTickeType>(initial_ticket);

	useEffect(() => {
		const errorArray: ErrorMessage[] = [];
		if (!ticket.title) {
			errorArray.push({
				message: "Bitte einen Titel angeben",
				key: "ticket_title",
				id: "ticket_title"
			});
		}
		if (!ticket.property) {
			errorArray.push({
				message: "Bitte ein zugehöriges Objekt auswählen",
				key: "ticket_object",
				id: "ticket_object"
			});
		}
		setErrors(errorArray);
	}, [ticket]);

	const createTicket = useCallback(async () => {
		const updateObject: TicketUpdateObject = {
			title: ticket.title,
			created_by: {
				__type: "Pointer",
				className: "User",
				objectId: user.objectId
			},
			description: ticket.description,
			images: ticket.images || [],
			is_closed: false,
			archived: false,
			state: "open",
			comments: []
		};

		if (ticket.property) {
			updateObject.property = {
				__type: "Pointer",
				className: "Property",
				objectId: ticket.property.id
			};
		}
		await createData({
			className: "Ticket",
			updateObject
		});
		setRefetchTicket(new Date());

		setTicket((draft) => {
			draft.title = initial_ticket.title;
			draft.description = initial_ticket.description;
			draft.property = initial_ticket.property;
			draft.images = initial_ticket.images;
		});

		setIsOpen(false);
	}, [ticket]);

	return (
		<>
			<button
				className={clsx(
					"full_button",
					"secondary",
					"md",
					"create_ticket_button"
				)}
				onClick={() => setIsOpen(true)}
			>
				<Plus strokeWidth={1} size={12} />
				Neues Ticket erstellen
			</button>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={async () => {
					setTicket((draft) => {
						draft.title = "";
						draft.description = "";
						draft.property = undefined;
						draft.images = [];
					});

					setIsOpen(false);
				}}
				confirmButtonHandler={() => createTicket()}
				header="Neues Ticket erstellen"
				buttonDisabled={[false, errors.length > 0]}
				errors={errors}
			>
				<div className="slidein_content">
					<div className="create_ticket_main_inputs_container">
						<div>
							<label>Titel</label>
							<input
								defaultValue={ticket.title}
								onChange={(e) =>
									setTicket((draft) => {
										draft.title = e.target.value;
									})
								}
								style={{ width: "100%" }}
							/>
						</div>
						<div>
							<label>Beschreibung</label>
							<textarea
								defaultValue={ticket.description}
								onChange={(e) =>
									setTicket((draft) => {
										draft.description = e.target.value;
									})
								}
								style={{ width: "100%" }}
							/>
						</div>
						<ObjectSelectWithState
							label="Objekt auswählen"
							selectedObject={ticket?.property}
							setSelectedObject={(value) =>
								setTicket((draft) => {
									draft.property = value;
								})
							}
							key="ticket_property_select"
						/>
						<ImageUploader
							label="Bild"
							onChange={(images) =>
								setTicket((draft) => {
									draft.images.push(
										...images.map((image) => image.objectId)
									);
								})
							}
							maxFileCount={10}
							deleteHandler={(image) =>
								setTicket((draft) => {
									const index = draft.images.findIndex(
										(i: string) => i === image.objectId
									);
									draft.images.splice(index, 1);
								})
							}
						/>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CreateTicket;
