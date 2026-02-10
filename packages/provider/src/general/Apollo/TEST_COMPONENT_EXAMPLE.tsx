/**
 * TEST COMPONENT EXAMPLE
 * 
 * This is a simple test component to verify the secure Apollo hooks work correctly.
 * Copy this to a page in your app to test the implementation.
 * 
 * Usage:
 * 1. Copy this file to your app (e.g., app/test-secure-hooks/page.tsx)
 * 2. Adjust the objectName and fields to match your data model
 * 3. Visit the page in your browser
 * 4. Open DevTools → Network tab
 * 5. Filter for "graphql"
 * 6. Verify NO sensitive headers are visible in requests!
 */

"use client";

import { useFindDataSecure, useGetDataSecure } from "@repo/provider";
import { useState } from "react";

export default function TestSecureHooks() {
	// Test useFindDataSecure
	const {
		loading: findLoading,
		data: findData,
		refetch: findRefetch,
		count,
		error: findError
	} = useFindDataSecure({
		objectName: "User", // Change to your class name
		fields: ["objectId", "username", "email", "createdAt"],
		limit: 10,
		order: "createdAt_DESC"
	});

	// Test useGetDataSecure with conditional loading
	const [selectedId, setSelectedId] = useState<string>("");
	const {
		loading: getLoading,
		data: getData,
		refetch: getRefetch,
		error: getError
	} = useGetDataSecure({
		objectName: "User", // Change to your class name
		fields: ["objectId", "username", "email", "createdAt", "updatedAt"],
		id: selectedId,
		skip: !selectedId
	});

	return (
		<div style={{ padding: "2rem", fontFamily: "system-ui" }}>
			<h1>🔒 Secure Apollo Hooks Test</h1>
			
			<div style={{ 
				background: "#f0f9ff", 
				border: "2px solid #0ea5e9", 
				borderRadius: "8px", 
				padding: "1rem",
				marginBottom: "2rem"
			}}>
				<h3>✅ Security Check</h3>
				<ol>
					<li>Open DevTools (F12)</li>
					<li>Go to Network tab</li>
					<li>Filter for "graphql"</li>
					<li>Click on a request</li>
					<li>Check Headers section</li>
					<li><strong>Verify NO X-Parse-* headers are visible!</strong></li>
				</ol>
			</div>

			<hr style={{ margin: "2rem 0" }} />

			{/* Test 1: useFindDataSecure */}
			<section>
				<h2>Test 1: useFindDataSecure</h2>
				<p>Fetching multiple records...</p>
				
				<button 
					onClick={() => findRefetch()}
					style={{
						padding: "0.5rem 1rem",
						marginBottom: "1rem",
						cursor: "pointer"
					}}
				>
					🔄 Refetch Data
				</button>

				{findLoading && (
					<div style={{ color: "#0ea5e9" }}>⏳ Loading...</div>
				)}

				{findError && (
					<div style={{ 
						color: "#dc2626", 
						background: "#fee2e2", 
						padding: "1rem",
						borderRadius: "4px"
					}}>
						❌ Error: {findError.message || JSON.stringify(findError)}
					</div>
				)}

				{!findLoading && !findError && (
					<div>
						<p><strong>Total Records:</strong> {count}</p>
						<p><strong>Showing:</strong> {findData.length} records</p>
						
						<div style={{ 
							maxHeight: "300px", 
							overflow: "auto",
							border: "1px solid #ddd",
							borderRadius: "4px"
						}}>
							<table style={{ 
								width: "100%", 
								borderCollapse: "collapse"
							}}>
								<thead>
									<tr style={{ background: "#f3f4f6", position: "sticky", top: 0 }}>
										<th style={{ padding: "0.5rem", textAlign: "left" }}>ID</th>
										<th style={{ padding: "0.5rem", textAlign: "left" }}>Username</th>
										<th style={{ padding: "0.5rem", textAlign: "left" }}>Email</th>
										<th style={{ padding: "0.5rem", textAlign: "left" }}>Actions</th>
									</tr>
								</thead>
								<tbody>
									{findData.map((item: any) => (
										<tr 
											key={item.objectId}
											style={{ 
												borderBottom: "1px solid #e5e7eb",
												background: selectedId === item.objectId ? "#fef3c7" : "white"
											}}
										>
											<td style={{ padding: "0.5rem" }}>
												{item.objectId?.substring(0, 8)}...
											</td>
											<td style={{ padding: "0.5rem" }}>
												{item.username || "N/A"}
											</td>
											<td style={{ padding: "0.5rem" }}>
												{item.email || "N/A"}
											</td>
											<td style={{ padding: "0.5rem" }}>
												<button
													onClick={() => setSelectedId(item.objectId)}
													style={{
														padding: "0.25rem 0.5rem",
														fontSize: "0.875rem",
														cursor: "pointer"
													}}
												>
													View Details
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</section>

			<hr style={{ margin: "2rem 0" }} />

			{/* Test 2: useGetDataSecure */}
			<section>
				<h2>Test 2: useGetDataSecure</h2>
				<p>Get single record by ID</p>

				<div style={{ marginBottom: "1rem" }}>
					<input
						type="text"
						placeholder="Enter object ID"
						value={selectedId}
						onChange={(e) => setSelectedId(e.target.value)}
						style={{
							padding: "0.5rem",
							width: "300px",
							marginRight: "0.5rem"
						}}
					/>
					<button 
						onClick={() => getRefetch()}
						disabled={!selectedId}
						style={{
							padding: "0.5rem 1rem",
							cursor: selectedId ? "pointer" : "not-allowed",
							opacity: selectedId ? 1 : 0.5
						}}
					>
						🔄 Refetch
					</button>
					<button 
						onClick={() => setSelectedId("")}
						style={{
							padding: "0.5rem 1rem",
							marginLeft: "0.5rem",
							cursor: "pointer"
						}}
					>
						Clear
					</button>
				</div>

				{!selectedId && (
					<div style={{ 
						color: "#6b7280", 
						fontStyle: "italic" 
					}}>
						👆 Select a user from the table above or enter an ID
					</div>
				)}

				{getLoading && (
					<div style={{ color: "#0ea5e9" }}>⏳ Loading record...</div>
				)}

				{getError && (
					<div style={{ 
						color: "#dc2626", 
						background: "#fee2e2", 
						padding: "1rem",
						borderRadius: "4px"
					}}>
						❌ Error: {getError.message || JSON.stringify(getError)}
					</div>
				)}

				{!getLoading && !getError && getData && (
					<div style={{ 
						background: "#f9fafb", 
						padding: "1rem",
						borderRadius: "4px",
						border: "1px solid #e5e7eb"
					}}>
						<h3>Record Details:</h3>
						<pre style={{ 
							background: "white", 
							padding: "1rem",
							borderRadius: "4px",
							overflow: "auto"
						}}>
							{JSON.stringify(getData, null, 2)}
						</pre>
					</div>
				)}
			</section>

			<hr style={{ margin: "2rem 0" }} />

			{/* Test 3: Polling Example */}
			<section>
				<h2>Test 3: Polling (Auto-refresh)</h2>
				<p>This would use <code>pollInterval</code> to auto-refresh data</p>
				<TestPolling />
			</section>
		</div>
	);
}

// Separate component to test polling
function TestPolling() {
	const [enabled, setEnabled] = useState(false);

	const { loading, data, count } = useFindDataSecure({
		objectName: "User",
		fields: ["objectId", "username"],
		limit: 5,
		pollInterval: enabled ? 5000 : 0 // Poll every 5 seconds when enabled
	});

	return (
		<div style={{ 
			background: "#f0fdf4", 
			padding: "1rem",
			borderRadius: "4px",
			border: "1px solid #86efac"
		}}>
			<label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
				<input
					type="checkbox"
					checked={enabled}
					onChange={(e) => setEnabled(e.target.checked)}
				/>
				<span>Enable Auto-refresh (every 5 seconds)</span>
			</label>

			{enabled && (
				<div style={{ marginTop: "1rem" }}>
					<p>
						{loading ? "🔄 Refreshing..." : "✅ Data up to date"} 
						{" - "} 
						{count} records
					</p>
					<small style={{ color: "#6b7280" }}>
						Last updated: {new Date().toLocaleTimeString()}
					</small>
				</div>
			)}

			{!enabled && (
				<p style={{ marginTop: "1rem", color: "#6b7280", fontStyle: "italic" }}>
					Enable to see data refresh automatically
				</p>
			)}
		</div>
	);
}
