import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerUser } from "./registerUser";

describe("registerUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns success when invite is valid and user is created", async () => {
		const post = vi
			.fn()
			.mockResolvedValueOnce({
				data: { result: { key: "invite-key-abc", roles: ["editor"] } },
			})
			.mockResolvedValueOnce({ data: { objectId: "user-1" } })
			.mockResolvedValueOnce({ data: { result: true } });

		const result = await registerUser({ post } as never, {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			password: "SecurePass123!",
			username: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" },
		});

		expect(result).toEqual({ status: "success" });
		expect(post).toHaveBeenCalledTimes(3);
		expect(post).toHaveBeenNthCalledWith(1, "functions/check_for_invite", {
			email: "user@example.com",
			project_id: "project-123",
		});
		expect(post).toHaveBeenNthCalledWith(2, "users", {
			username: "user@example.com",
			name: "Max Mustermann",
			password: "SecurePass123!",
			email: "user@example.com",
			projects: ["project-123"],
			is_superuser: false,
			roles: ["editor"],
		});
		expect(post).toHaveBeenNthCalledWith(
			3,
			"functions/remove_invitation_key",
			{
				key: "invite-key-abc",
				project_id: "project-123",
			},
		);
	});

	it("returns invalid invitation when the invite key does not match", async () => {
		const post = vi.fn().mockResolvedValueOnce({
			data: { result: { key: "different-key" } },
		});

		const result = await registerUser({ post } as never, {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			password: "SecurePass123!",
			username: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" },
		});

		expect(result).toEqual({
			status: "error",
			message: "Einladung ungültig",
		});
		expect(post).toHaveBeenCalledTimes(1);
	});

	it("returns an error when the invite check fails", async () => {
		const post = vi.fn().mockRejectedValueOnce(new Error("network error"));

		const result = await registerUser({ post } as never, {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			password: "SecurePass123!",
			username: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" },
		});

		expect(result).toEqual({
			status: "error",
			message: "Einladung konnte nicht geprüft werden.",
		});
	});

	it("returns duplicate username error for Parse code 202", async () => {
		const post = vi
			.fn()
			.mockResolvedValueOnce({
				data: { result: { key: "invite-key-abc", roles: [] } },
			})
			.mockRejectedValueOnce({
				response: { data: { code: 202 } },
			});

		const result = await registerUser({ post } as never, {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			password: "SecurePass123!",
			username: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" },
		});

		expect(result).toEqual({
			status: "error",
			message:
				"Für diesen Nutzernamen besteht bereits ein Account. Bitte wählen Sie einen anderen.",
		});
	});

	it("returns duplicate email error for Parse code 203", async () => {
		const post = vi
			.fn()
			.mockResolvedValueOnce({
				data: { result: { key: "invite-key-abc", roles: [] } },
			})
			.mockRejectedValueOnce({
				response: { data: { code: 203 } },
			});

		const result = await registerUser({ post } as never, {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			password: "SecurePass123!",
			username: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" },
		});

		expect(result).toEqual({
			status: "error",
			message: "Für diese E-Mail Adresse besteht bereits ein Account",
		});
	});
});
