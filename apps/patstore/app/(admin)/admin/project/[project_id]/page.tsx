import { Project } from "@repo/modules";

const AdminProject = ({params = {project_id: ''}}) => <Project params={params} />;

export default AdminProject;
