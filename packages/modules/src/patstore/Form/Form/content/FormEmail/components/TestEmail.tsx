import { FC, useState } from "react";
import { Modal } from "@repo/ui";
import { TestEmailProps } from "../types";

const TestEmail: FC<TestEmailProps> = ({ testEmail, setTestEmail }) => {
	const [email, setEmail] = useState<string>("");
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
				console.log(`Sending test email to: ${email}`);
				setTestEmail(false);
			}}
		>
			<p>
				Geben Sie eine E-MAil Adresse an, an an die Eine Test-Email
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
