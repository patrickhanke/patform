import { useGetData } from "@repo/provider";
import { IconButton, Loader } from "@repo/ui";
import { useRouter } from "next/navigation";

const AppModule = ({ id, projectId }: { id: string; projectId: string }) => {
	const router = useRouter();
	const { data, loading } = useGetData({
		objectName: "Module",
		fields: ["objectId", "name", "createdAt"],
		id
	});

	if (loading) return <Loader width="100%" height="30px" />;
	const module = data;
	if (!module) return null;

	return (
		<div
			style={{ width: "fit-content" }}
			className="flex row gap-md a-ce j-sb"
		>
			<div style={{ width: "300px" }}>
				<h3>{module?.name}</h3>
			</div>
			<IconButton
				icon="link"
				onClick={() =>
					router.push(`/admin/projects/${projectId}/${id}`)
				}
			/>
		</div>
	);
};

export default AppModule;
