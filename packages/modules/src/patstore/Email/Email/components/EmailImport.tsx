import { ApolloRefetch, useDataHandler, useFindData } from "@repo/provider";
import { ElementSelectInterface, Modal, SelectElement } from "@repo/ui";
import { useCallback, useMemo, useState } from "react";

const EmailImport = ({
	emailId,
	projectId,
	importModalOpen,
	setImportModalOpen,
	refetch
}: {
	emailId: string;
	projectId: string;
	importModalOpen: boolean;
	setImportModalOpen: (open: boolean) => void;
	refetch: ApolloRefetch;
}) => {
	const { updateData } = useDataHandler();
	const [selectedEmail, setSelectedEmail] = useState<string | undefined>(
		undefined
	);
	const [loading, setLoading] = useState(false);
	const { data: emails } = useFindData({
		objectName: "Email",
		fields: ["objectId", "title", "content"],
		projectId
	});
	const selectElements: SelectElement[] = useMemo(() => {
		return emails?.map((email) => ({
			value: email.objectId,
			label: email.title
		}));
	}, [emails]);

	if (!emails) {
		return <div>Email nicht gefunden</div>;
	}

	const updateEmail = useCallback(async () => {
		setLoading(true);
		const emailContent = emails?.find(
			(email) => email.objectId === selectedEmail
		)?.content;

		if (selectedEmail) {
			await updateData({
				className: "Email",
				objectId: emailId,
				updateObject: {
					content: emailContent
				}
			});
			setImportModalOpen(false);
		}
		await refetch();
		setLoading(false);
	}, [selectedEmail]);

	return (
		<Modal
			isOpen={importModalOpen}
			cancelButtonHandler={() => setImportModalOpen(false)}
			confirmButtonHandler={() => {
				updateEmail();
			}}
			header={"Importieren"}
			buttonDisabled={[loading, !selectedEmail || loading]}
		>
			<p>Importieren Sie eine E-Mail aus einem anderen Projekt.</p>
			<ElementSelectInterface
				elements={selectElements}
				onSelect={(elements) => {
					setSelectedEmail(elements[0]?.value as string);
				}}
				selectedElements={selectElements.filter(
					(element) => element.value === selectedEmail
				)}
			/>
		</Modal>
	);
};

export default EmailImport;
