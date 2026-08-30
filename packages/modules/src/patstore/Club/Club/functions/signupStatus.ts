export const signupStatusLabel = (status?: string) => {
	switch (status) {
		case "erstellt":
			return "Erstellt";
		case "eingeladen":
			return "Eingeladen";
		case "gemeldet":
			return "Gemeldet";
		case "eingereicht":
			return "Eingereicht";
		default:
			return status || "—";
	}
};

export const isFemaleClass = (classValue?: string) => {
	if (!classValue) {
		return false;
	}
	return ["flk", "f35", "wJ1518", "wJ1114"].includes(classValue);
};

export const canSubmitSignup = (
	personIds: string[],
	captainId?: string
) => personIds.length >= 3 && Boolean(captainId);

export const isSignupLocked = (status?: string) =>
	status === "gemeldet" || status === "eingereicht";
