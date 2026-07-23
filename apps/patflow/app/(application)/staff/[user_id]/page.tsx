import { Suspense } from "react";
import { StaffMember } from "@repo/modules";

export default function Page({
	params,
}: {
	params: Promise<{ user_id: string }>;
}) {
	return (
		<Suspense fallback={<p>Lädt...</p>}>
			<StaffMember params={params} />
		</Suspense>
	);
}
