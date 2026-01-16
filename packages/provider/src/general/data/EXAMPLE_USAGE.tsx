/**
 * Example Usage of useDataHandlerSecure
 *
 * This file demonstrates how to use the secure data handler in various scenarios.
 */

import React, { useState, useEffect } from "react";
import { useDataHandlerSecure } from "@patform/provider/general/data";

// ============================================================================
// Example 1: Basic Data Fetching
// ============================================================================
export function UsersList() {
	const { getData, loading } = useDataHandlerSecure();
	const [users, setUsers] = useState<any[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const data = await getData({ className: "User" });
			setUsers(data);
		};
		fetchUsers();
	}, [getData]);

	if (loading) return <div>Loading users...</div>;

	return (
		<ul>
			{users.map((user) => (
				<li key={user.objectId}>{user.name}</li>
			))}
		</ul>
	);
}

// ============================================================================
// Example 2: Creating Data with Feedback
// ============================================================================
export function CreateUserForm() {
	const { createData, loading } = useDataHandlerSecure();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await createData({
			className: "User",
			updateObject: {
				name,
				email,
				active: true
			},
			afterSaveHandler: (data) => {
				console.log("User created with ID:", data.objectId);
				// Reset form
				setName("");
				setEmail("");
			},
			feedback: "User created successfully!"
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Name"
				required
			/>
			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				type="email"
				required
			/>
			<button type="submit" disabled={loading}>
				{loading ? "Creating..." : "Create User"}
			</button>
		</form>
	);
}

// ============================================================================
// Example 3: Updating Data with Error Handling
// ============================================================================
export function UpdateUserButton({
	userId,
	currentName
}: {
	userId: string;
	currentName: string;
}) {
	const { updateData, loading } = useDataHandlerSecure();
	const [error, setError] = useState<string | null>(null);

	const handleUpdate = async () => {
		setError(null);

		await updateData({
			className: "User",
			objectId: userId,
			updateObject: {
				name: currentName + " (Updated)",
				lastModified: new Date().toISOString()
			},
			afterSaveHandler: (id) => {
				console.log("Updated user:", id);
			},
			feedback: "User updated successfully",
			onError: (errorMessage) => {
				setError(errorMessage);
			}
		});
	};

	return (
		<div>
			<button onClick={handleUpdate} disabled={loading}>
				{loading ? "Updating..." : "Update User"}
			</button>
			{error && <div style={{ color: "red" }}>{error}</div>}
		</div>
	);
}

// ============================================================================
// Example 4: Deleting Data with Confirmation
// ============================================================================
export function DeleteUserButton({
	userId,
	userName
}: {
	userId: string;
	userName: string;
}) {
	const { deleteData, loading } = useDataHandlerSecure();

	const handleDelete = async () => {
		if (!confirm(`Are you sure you want to delete ${userName}?`)) {
			return;
		}

		await deleteData({
			className: "User",
			objectId: userId,
			afterSaveHandler: (id) => {
				console.log("Deleted user:", id);
				// Refresh list or navigate away
			},
			feedback: "User deleted successfully"
		});
	};

	return (
		<button onClick={handleDelete} disabled={loading}>
			{loading ? "Deleting..." : "Delete User"}
		</button>
	);
}

// ============================================================================
// Example 5: Querying Data with Filters
// ============================================================================
export function ActiveUsersList() {
	const { getData, loading } = useDataHandlerSecure();
	const [activeUsers, setActiveUsers] = useState<any[]>([]);

	useEffect(() => {
		const fetchActiveUsers = async () => {
			// Query for active users only
			const data = await getData({
				className: "User",
				query: '"active":true,"role":"admin"'
			});
			setActiveUsers(data);
		};
		fetchActiveUsers();
	}, [getData]);

	if (loading) return <div>Loading active users...</div>;

	return (
		<div>
			<h2>Active Users ({activeUsers.length})</h2>
			<ul>
				{activeUsers.map((user) => (
					<li key={user.objectId}>
						{user.name} - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
}

// ============================================================================
// Example 6: File Upload
// ============================================================================
export function FileUploadForm() {
	const { uploadFile } = useDataHandlerSecure();
	const [uploading, setUploading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const parseFile = await uploadFile({ file });
			console.log("File uploaded:", parseFile.url());
			alert("File uploaded successfully!");
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Failed to upload file");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<input
				type="file"
				onChange={handleFileChange}
				disabled={uploading}
			/>
			{uploading && <span>Uploading...</span>}
		</div>
	);
}

// ============================================================================
// Example 7: Advanced - CRUD Operations Component
// ============================================================================
export function UserManager() {
	const { getData, createData, updateData, deleteData, loading } =
		useDataHandlerSecure();
	const [users, setUsers] = useState<any[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({ name: "", email: "" });

	// Fetch users
	const fetchUsers = async () => {
		const data = await getData({ className: "User" });
		setUsers(data);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// Create new user
	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		await createData({
			className: "User",
			updateObject: formData,
			afterSaveHandler: () => {
				fetchUsers();
				setFormData({ name: "", email: "" });
			},
			feedback: "User created!"
		});
	};

	// Update user
	const handleUpdate = async (userId: string) => {
		await updateData({
			className: "User",
			objectId: userId,
			updateObject: formData,
			afterSaveHandler: () => {
				fetchUsers();
				setEditingId(null);
				setFormData({ name: "", email: "" });
			},
			feedback: "User updated!"
		});
	};

	// Delete user
	const handleDelete = async (userId: string) => {
		if (!confirm("Delete this user?")) return;

		await deleteData({
			className: "User",
			objectId: userId,
			afterSaveHandler: fetchUsers,
			feedback: "User deleted!"
		});
	};

	return (
		<div>
			<h1>User Manager</h1>

			{/* Create/Edit Form */}
			<form
				onSubmit={
					editingId
						? (e) => {
								e.preventDefault();
								handleUpdate(editingId);
							}
						: handleCreate
				}
			>
				<input
					value={formData.name}
					onChange={(e) =>
						setFormData({ ...formData, name: e.target.value })
					}
					placeholder="Name"
					required
				/>
				<input
					value={formData.email}
					onChange={(e) =>
						setFormData({ ...formData, email: e.target.value })
					}
					placeholder="Email"
					type="email"
					required
				/>
				<button type="submit" disabled={loading}>
					{editingId ? "Update" : "Create"} User
				</button>
				{editingId && (
					<button
						type="button"
						onClick={() => {
							setEditingId(null);
							setFormData({ name: "", email: "" });
						}}
					>
						Cancel
					</button>
				)}
			</form>

			{/* Users List */}
			{loading && <div>Loading...</div>}
			<ul>
				{users.map((user) => (
					<li key={user.objectId}>
						<span>
							{user.name} - {user.email}
						</span>
						<button
							onClick={() => {
								setEditingId(user.objectId);
								setFormData({
									name: user.name,
									email: user.email
								});
							}}
						>
							Edit
						</button>
						<button onClick={() => handleDelete(user.objectId)}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

// ============================================================================
// Example 8: Using Master Key (Admin Operations)
// ============================================================================
export function AdminUserManager() {
	// Enable master key for admin operations
	const { getData, updateData } = useDataHandlerSecure(true);
	const [users, setUsers] = useState<any[]>([]);

	useEffect(() => {
		const fetchAllUsers = async () => {
			// Master key allows bypassing ACL/CLP restrictions
			const data = await getData({ className: "User" });
			setUsers(data);
		};
		fetchAllUsers();
	}, []);

	const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
		await updateData({
			className: "User",
			objectId: userId,
			updateObject: {
				active: !currentStatus
			},
			afterSaveHandler: () => {
				// Refresh list
				setUsers(
					users.map((u) =>
						u.objectId === userId
							? { ...u, active: !currentStatus }
							: u
					)
				);
			},
			feedback: "User status updated"
		});
	};

	return (
		<div>
			<h2>Admin User Manager</h2>
			<ul>
				{users.map((user) => (
					<li key={user.objectId}>
						{user.name} -
						<span style={{ color: user.active ? "green" : "red" }}>
							{user.active ? "Active" : "Inactive"}
						</span>
						<button
							onClick={() =>
								toggleUserStatus(user.objectId, user.active)
							}
						>
							Toggle Status
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

// ============================================================================
// Example 9: Without Project Key (Global Data)
// ============================================================================
export function GlobalSettings() {
	// Disable automatic project key addition for global settings
	const { getData, updateData } = useDataHandlerSecure(false, false);
	const [settings, setSettings] = useState<any>(null);

	useEffect(() => {
		const fetchSettings = async () => {
			const data = await getData({
				className: "GlobalSettings",
				query: '"key":"app_config"'
			});
			if (data.length > 0) {
				setSettings(data[0]);
			}
		};
		fetchSettings();
	}, []);

	const updateSetting = async (key: string, value: any) => {
		if (!settings) return;

		await updateData({
			className: "GlobalSettings",
			objectId: settings.objectId,
			updateObject: {
				[key]: value
			},
			afterSaveHandler: () => {
				setSettings({ ...settings, [key]: value });
			},
			feedback: "Settings updated"
		});
	};

	if (!settings) return <div>Loading settings...</div>;

	return (
		<div>
			<h2>Global Settings</h2>
			<button
				onClick={() =>
					updateSetting("maintenanceMode", !settings.maintenanceMode)
				}
			>
				{settings.maintenanceMode ? "Disable" : "Enable"} Maintenance
				Mode
			</button>
		</div>
	);
}
