import { Suspense } from "react";
import { cookies } from "next/headers";
import { Form } from "@repo/modules";
import { fetchFormById } from "@repo/provider";
import { PageSkeleton } from "@repo/ui";

async function FormPageContent({
	params
}: {
	params: Promise<{ form_id: string }>;
}) {
	const { form_id } = await params;
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("patstore_token")?.value;

	const form = await fetchFormById({ id: form_id, sessionToken });

	if (!form) {
		return <p>Formular nicht gefunden</p>;
	}

	return <Form formId={form_id} initialForm={form} />;
}

export default function FormPage({
	params
}: {
	params: Promise<{ form_id: string }>;
}) {
	return (
		<Suspense fallback={<PageSkeleton pageStates={3} />}>
			<FormPageContent params={params} />
		</Suspense>
	);
}
