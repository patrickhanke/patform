const requestDeployWebhook = (objectClass: string, projectId?: string) => {
	void fetch("/api/deploy-hook", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ objectClass, projectId })
	}).catch(() => {
		console.error("Deploy-Webhook konnte nicht ausgelöst werden");
	});
};

export default requestDeployWebhook;
