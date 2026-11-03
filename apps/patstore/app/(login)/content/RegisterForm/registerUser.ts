import type { AxiosInstance } from "axios";

type RegisterUserReservedKey =
	| "email"
	| "username"
	| "password"
	| "password_confirmation";

type RegisterUserFieldValue = string | boolean | number | null;

export type RegisterUserValues = {
	[K in string as K extends RegisterUserReservedKey ? never : K]: RegisterUserFieldValue;
};

export type RegisterUserResult =
	| { status: "success" }
	| { status: "error"; message: string };

type RegisterResponse = {
	success?: boolean;
	message?: string;
	type?: string;
};

// Invite validation, user creation and role assignment happen server-side in the
// `register_with_invite` cloud function; the client never sees the invite key of others.
export async function registerUser(
	client: Pick<AxiosInstance, "post">,
	params: {
		email: string;
		projectId: string;
		invitationKey: string;
		password: string;
		username: string;
		values: RegisterUserValues;
	},
): Promise<RegisterUserResult> {
	let registerResponse: RegisterResponse | undefined;

	try {
		const response = await client.post("functions/register_with_invite", {
			email: params.email,
			project_id: params.projectId,
			key: params.invitationKey,
			password: params.password,
			name: params.username,
			values: params.values,
		});
		registerResponse = response.data.result;
	} catch {
		return {
			status: "error",
			message: "Registrierung fehlgeschlagen.",
		};
	}

	if (registerResponse?.success) {
		return { status: "success" };
	}

	if (registerResponse?.type === "invite-invalid") {
		return { status: "error", message: "Einladung ungültig" };
	}

	return {
		status: "error",
		message: registerResponse?.message || "Registrierung fehlgeschlagen.",
	};
}
