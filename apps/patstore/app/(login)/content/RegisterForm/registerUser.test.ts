import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerUser } from "./registerUser";

const params = {
	email: "user@example.com",
	projectId: "project-123",
	invitationKey: "invite-key-abc",
	password: "SecurePass123!",
	username: "user@example.com",
	values: { first_name: "Max", last_name: "Mustermann" }
};

describe("registerUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("registers through the register_with_invite cloud function", async () => {
		const post = vi.fn().mockResolvedValueOnce({
			data: { result: { success: true, type: "user-created" } }
		});

		const result = await registerUser({ post } as never, params);

		expect(result).toEqual({ status: "success" });
		expect(post).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledWith("functions/register_with_invite", {
			email: "user@example.com",
			project_id: "project-123",
			key: "invite-key-abc",
			password: "SecurePass123!",
			name: "user@example.com",
			values: { first_name: "Max", last_name: "Mustermann" }
		});
	});

	it("never sends authorization fields itself", async () => {
		const post = vi.fn().mockResolvedValueOnce({
			data: { result: { success: true } }
		});

		await registerUser({ post } as never, params);

		const payload = post.mock.calls[0][1];
		expect(payload).not.toHaveProperty("roles");
		expect(payload).not.toHaveProperty("projects");
		expect(payload).not.toHaveProperty("is_superuser");
	});

	it("returns invalid invitation when the server rejects the invite", async () => {
		const post = vi.fn().mockResolvedValueOnce({
			data: {
				result: { success: false, type: "invite-invalid", message: "Einladung ungültig" }
			}
		});

		const result = await registerUser({ post } as never, params);

		expect(result).toEqual({
			status: "error",
			message: "Einladung ungültig"
		});
	});

	it("returns an error when the request fails", async () => {
		const post = vi.fn().mockRejectedValueOnce(new Error("network error"));

		const result = await registerUser({ post } as never, params);

		expect(result).toEqual({
			status: "error",
			message: "Registrierung fehlgeschlagen."
		});
	});

	it("passes through the server message for existing accounts", async () => {
		const post = vi.fn().mockResolvedValueOnce({
			data: {
				result: {
					success: false,
					type: "user-exists",
					message: "Für diese E-Mail Adresse besteht bereits ein Account"
				}
			}
		});

		const result = await registerUser({ post } as never, params);

		expect(result).toEqual({
			status: "error",
			message: "Für diese E-Mail Adresse besteht bereits ein Account"
		});
	});
});
