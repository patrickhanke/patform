const createProjectName = (title: string, projectPath: string) => {
	return (
		title.toLowerCase().replace(/ /g, "_") +
		"_" +
		projectPath.toLowerCase().replace(/ /g, "_")
	);
};

export default createProjectName;
