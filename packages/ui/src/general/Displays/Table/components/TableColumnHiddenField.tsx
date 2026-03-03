import { useCallback, useState } from "react";
import { Button, IconButton, InfoBox, Modal } from "@repo/ui";
import { axiosclient, useDataHandlerSecure } from "@repo/provider";

const DEFAULT_HIDDEN_VALUE = "********";

const TableColumnHiddenField = ({
	id,
	className,
	field
}: {
	id: string;
	className: string;
	field: string;
}) => {
	const { updateData } = useDataHandlerSecure(true);
	const [open, setOpen] = useState(false);
	const [revealed, setRevealed] = useState(false);
	const [hiddenValue, setHiddenValue] =
		useState<string>(DEFAULT_HIDDEN_VALUE);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	const getHiddenValue = useCallback(async () => {
		if (revealed) {
			setRevealed(false);
			setHiddenValue(DEFAULT_HIDDEN_VALUE);
			return;
		}

		setLoading(true);
		const response = await axiosclient().post(
			"functions/get_hidden_value",
			{
				className,
				id,
				field
			}
		);
		setLoading(false);
		setHiddenValue(response.data.result.value);
		setRevealed(true);
	}, [id, className, field, revealed]);

	const updateHiddenValue = useCallback(async () => {
		setLoading(true);
		await updateData({
			className,
			objectId: id,
			updateObject: {
				[field]: hiddenValue
			}
		});
		setLoading(false);
	}, [id, className, field, hiddenValue]);

	const closeModal = useCallback(() => {
		setHiddenValue(DEFAULT_HIDDEN_VALUE);
		setEdit(false);
		setOpen(false);
		setRevealed(false);
	}, []);

	return (
		<>
			<Button
				color="dark"
				size={12}
				onClick={() => setOpen(!open)}
				text="Anzeigen"
			/>
			<Modal
				isOpen={open}
				cancelButtonHandler={closeModal}
				confirmButtonHandler={async () => {
					await updateHiddenValue();
					closeModal();
				}}
				header={"Objekt bearbeiten"}
				buttonDisabled={[false, false]}
			>
				<div className="flex col a-ce j-sb gap-sm">
					<div>
						{edit ? (
							<input
								width="300px"
								type="text"
								defaultValue={hiddenValue}
								onChange={(e) => setHiddenValue(e.target.value)}
							/>
						) : (
							<p>{hiddenValue}</p>
						)}
					</div>
					<div className="button_container">
						<IconButton
							color="primary"
							onClick={() => getHiddenValue()}
							icon={revealed ? "eye-off" : "eye"}
							text={revealed ? "Verbergen" : "Anzeigen"}
							disabled={loading}
						/>
						<IconButton
							onClick={() => setEdit(!edit)}
							icon="edit"
							disabled={loading || !revealed}
							text="Bearbeiten"
						/>
					</div>
					{edit && (
						<InfoBox
							maxWidth="360px"
							text="Bei einer Änderung der E-Mail Adresse, kann es sein, dass der Nutzer sich mit seinen Daten nicht mehr anmelden kann."
						/>
					)}
				</div>
			</Modal>
		</>
	);
};

export default TableColumnHiddenField;
