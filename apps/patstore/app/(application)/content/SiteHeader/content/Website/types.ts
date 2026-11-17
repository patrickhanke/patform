export type WebsiteBuildStatus = "success" | "building" | "failed";

export type WebsiteDeployment = {
	id: string;
	status: WebsiteBuildStatus;
	createdAt: string;
	commit: string;
	message: string;
};

export type WebsiteBuildState = {
	applicable: boolean;
	deployments: WebsiteDeployment[];
	error?: string;
};

export type WebsiteActionResult = {
	ok: boolean;
	error?: string;
};
