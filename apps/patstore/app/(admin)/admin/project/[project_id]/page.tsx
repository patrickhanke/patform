import { Project } from "@repo/modules";

const AdminProject = ({params}: {params: {project_id: string}}) => <Project params={params} />;

export default AdminProject;
