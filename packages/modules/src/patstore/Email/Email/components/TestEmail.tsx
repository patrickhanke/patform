import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { Modal } from "@repo/ui";
import {
	axiosclient,
	compileAxiosError,
	PatstoreAppContext
} from "@repo/provider";

export type TestEmailProps = {
	testEmail: boolean;
	setTestEmail: Dispatch<SetStateAction<boolean>>;
	emailId: string;
};

const TestEmail: FC<TestEmailProps> = ({
	testEmail,
	setTestEmail,
	emailId
}) => {
	const [email, setEmail] = useState<string>("");
	const { project } = useContext(PatstoreAppContext);

	return (
		<Modal
			header="Test E-Mail"
			isOpen={testEmail}
			cancelButtonHandler={() => setTestEmail(false)}
			confirmButtonHandler={async () => {
				if (!email) {
					return;
				}
				// Here you would typically send the email using an API call
				await axiosclient()
					.post("functions/send_test_email", {
						email,
						form_id: emailId,
						project_id: project.objectId
					})
					.then((response) => {
						return response.data.result;
					})
					.catch((error) => {
						return compileAxiosError(error);
					});
				setTestEmail(false);
			}}
		>
			<p>
				Geben Sie eine E-Mail Adresse an, an an die Eine Test-Email
				gesendet werden soll
			</p>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="E-Mail Adresse"
				className="w-full p-2 border border-gray-300 rounded"
			/>
		</Modal>
	);
};

export default TestEmail;
