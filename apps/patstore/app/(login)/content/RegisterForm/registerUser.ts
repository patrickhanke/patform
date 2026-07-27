import type { AxiosInstance } from "axios";

export type RegisterUserValues = {
	username: string;
	password: string;
};

export type RegisterUserResult =
	| { status: "success" }
	| { status: "error"; message: string };

type InviteCheckResponse = {
	key?: string;
	roles?: string[];
};

export async function registerUser(
	client: Pick<AxiosInstance, "post">,
	params: {
		email: string;
		projectId: string;
		invitationKey: string;
		values: RegisterUserValues;
	},
): Promise<RegisterUserResult> {
	let inviteResponse: InviteCheckResponse | undefined;

	try {
		const response = await client.post("functions/check_for_invite", {
			email: params.email,
			project_id: params.projectId,
		});
		inviteResponse = response.data.result;
	} catch {
		return {
			status: "error",
			message: "Einladung konnte nicht geprüft werden.",
		};
	}

	if (!inviteResponse?.key || params.invitationKey !== inviteResponse.key) {
		return { status: "error", message: "Einladung ungültig" };
	}

	try {
		await client.post("users", {
			username: params.email,
			name: params.values.username,
			password: params.values.password,
			email: params.email,
			projects: [params.projectId],
			is_superuser: false,
			roles: inviteResponse.roles || [],
		});

		await client.post("functions/remove_invitation_key", {
			key: inviteResponse.key,
			project_id: params.projectId,
		});

		return { status: "success" };
	} catch (error: unknown) {
		const code = (error as { response?: { data?: { code?: number } } })
			.response?.data?.code;

		if (code === 202) {
			return {
				status: "error",
				message:
					"Für diesen Nutzernamen besteht bereits ein Account. Bitte wählen Sie einen anderen.",
			};
		}

		if (code === 203) {
			return {
				status: "error",
				message: "Für diese E-Mail Adresse besteht bereits ein Account",
			};
		}

		return {
			status: "error",
			message: "Registrierung fehlgeschlagen.",
		};
	}
}
