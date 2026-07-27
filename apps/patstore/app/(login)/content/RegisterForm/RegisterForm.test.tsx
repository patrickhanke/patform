import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Module, PatstoreProject } from "@repo/types";
import RegisterForm from "./RegisterForm";
import { registerUser } from "./registerUser";

vi.mock("./registerUser", () => ({
	registerUser: vi.fn(),
}));

vi.mock("@repo/ui", () => ({
	getDatabaseDefaultFields: () => [
		{
			id: "username",
			name: "username",
			type: "text",
			label: "Name",
			validation: { validate: true, required: "Pflichtfeld" },
		},
	],
	Form: ({
		formSubmitHandler,
		formValidationHandler,
	}: {
		formSubmitHandler?: (values: {
			username: string;
			password: string;
		}) => void;
		formValidationHandler?: (isValid: boolean) => void;
	}) => (
		<div data-testid="register-form">
			<button
				type="button"
				data-testid="mark-form-invalid"
				onClick={() => formValidationHandler?.(false)}
			>
				Mark invalid
			</button>
			<button
				type="button"
				data-testid="mark-form-valid"
				onClick={() => formValidationHandler?.(true)}
			>
				Mark valid
			</button>
			<button
				type="button"
				data-testid="submit-registration"
				onClick={() =>
					formSubmitHandler?.({
						username: "Max Mustermann",
						password: "SecurePass123!",
					})
				}
			>
				Submit registration
			</button>
		</div>
	),
	IconButton: ({
		text,
		onClick,
		disabled,
		loading,
	}: {
		text?: string;
		onClick?: () => void;
		disabled?: boolean;
		loading?: boolean;
	}) => (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-busy={loading}
		>
			{text}
		</button>
	),
}));

const mockRegisterUser = vi.mocked(registerUser);

const project: PatstoreProject = {
	name: "Demo Projekt",
	description: "Test project",
	objectId: "project-123",
	content: [],
	logo: { url: "", name: "" },
	path: "demo-projekt",
	modules: [],
	invitations: [],
	settings: {
		email: "",
		lettermint_key: "",
		lettermint_project_id: "",
		user_invitations: true,
		user_creation: true,
	},
};

const module: Module = {
	objectId: "module-123",
	label: "Benutzer",
	path: "/users",
	icon: "users",
	fields: [
		{
			id: "title",
			label: "Name",
			type: "text",
			required: true,
			active: true,
		},
	],
	connected_class: "User",
	categories: [],
	settings: {},
	default_fields: ["title"],
	project: project as Module["project"],
};

const defaultProps = {
	email: "user@example.com",
	project,
	module,
	invitationKey: "invite-key-abc",
};

describe("RegisterForm", () => {
	beforeEach(() => {
		mockRegisterUser.mockReset();
	});

	it("renders the invited email address and registration controls", () => {
		render(<RegisterForm {...defaultProps} />);

		expect(screen.getByText("E-Mail Adresse")).toBeInTheDocument();
		expect(screen.getByText("user@example.com")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Registrieren" })).toBeDisabled();
		expect(screen.getByTestId("register-form")).toBeInTheDocument();
	});

	it("shows the success message after a successful registration", async () => {
		const user = userEvent.setup();
		mockRegisterUser.mockResolvedValueOnce({ status: "success" });

		render(<RegisterForm {...defaultProps} />);

		await user.click(screen.getByTestId("submit-registration"));

		await waitFor(() => {
			expect(
				screen.getByText(/Sie haben sich erfolgreich für das Projekt Demo Projekt registriert/),
			).toBeInTheDocument();
		});

		expect(
			screen.getByRole("link", { name: "hier" }),
		).toHaveAttribute("href", "https://store.patwork.net/login/demo-projekt");
		expect(mockRegisterUser).toHaveBeenCalledWith(expect.anything(), {
			email: "user@example.com",
			projectId: "project-123",
			invitationKey: "invite-key-abc",
			values: {
				username: "Max Mustermann",
				password: "SecurePass123!",
			},
		});
	});

	it("shows an invalid invitation error", async () => {
		const user = userEvent.setup();
		mockRegisterUser.mockResolvedValueOnce({
			status: "error",
			message: "Einladung ungültig",
		});

		render(<RegisterForm {...defaultProps} />);

		await user.click(screen.getByTestId("submit-registration"));

		await waitFor(() => {
			expect(screen.getByText("Einladung ungültig")).toBeInTheDocument();
		});
	});

	it("shows a duplicate username error", async () => {
		const user = userEvent.setup();
		mockRegisterUser.mockResolvedValueOnce({
			status: "error",
			message:
				"Für diesen Nutzernamen besteht bereits ein Account. Bitte wählen Sie einen anderen.",
		});

		render(<RegisterForm {...defaultProps} />);

		await user.click(screen.getByTestId("submit-registration"));

		await waitFor(() => {
			expect(
				screen.getByText(
					"Für diesen Nutzernamen besteht bereits ein Account. Bitte wählen Sie einen anderen.",
				),
			).toBeInTheDocument();
		});
	});

	it("shows a duplicate email error", async () => {
		const user = userEvent.setup();
		mockRegisterUser.mockResolvedValueOnce({
			status: "error",
			message: "Für diese E-Mail Adresse besteht bereits ein Account",
		});

		render(<RegisterForm {...defaultProps} />);

		await user.click(screen.getByTestId("submit-registration"));

		await waitFor(() => {
			expect(
				screen.getByText(
					"Für diese E-Mail Adresse besteht bereits ein Account",
				),
			).toBeInTheDocument();
		});
	});

	it("shows an error when the invite check fails", async () => {
		const user = userEvent.setup();
		mockRegisterUser.mockResolvedValueOnce({
			status: "error",
			message: "Einladung konnte nicht geprüft werden.",
		});

		render(<RegisterForm {...defaultProps} />);

		await user.click(screen.getByTestId("submit-registration"));

		await waitFor(() => {
			expect(
				screen.getByText("Einladung konnte nicht geprüft werden."),
			).toBeInTheDocument();
		});
	});
});
