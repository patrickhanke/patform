"use client";

import { FC } from "react";
import { PatstoreUser } from "@repo/types";
import { StateDisplay, Divider, IconButton } from "@repo/ui";

interface EmailListProps {
	emails: PatstoreUser["emails"];
	projectListIds: Set<string>;
	onEmailClick: (email: string, index: number) => void;
	onAddEmail: () => void;
}

const EmailList: FC<EmailListProps> = ({
	emails,
	projectListIds,
	onEmailClick,
	onAddEmail
}) => {
	return (
		<div className="flex col gap-md">
			<div className="flex col gap-sm">
				<h4>E-Mail-Adressen</h4>
				<p style={{ fontSize: "0.9rem", color: "#666" }}>
					Klicken Sie auf eine E-Mail-Adresse, um die
					Listenzugehörigkeit zu verwalten.
				</p>
			</div>

			<Divider showLine size="small" />

			{emails && emails.length > 0 ? (
				<div className="flex col gap-sm">
					{emails.map((emailEntry, index) => {
						const lists = emailEntry?.lists || [];
						// Count only lists from current project
						const projectListsCount = lists.filter((listId) =>
							projectListIds.has(listId)
						).length;

						// Count lists from other projects
						const otherProjectListsCount = lists.filter(
							(listId) => !projectListIds.has(listId)
						).length;

						return (
							<div
								key={index}
								className="flex row a-ce j-sb gap-sm w-100"
								style={{
									width: "100%",
									padding: "1rem",
									border: emailEntry?.suppression?.suppressed
										? `1px solid red`
										: "1px solid #e0e0e0",
									borderRadius: "8px",
									cursor: "pointer",
									transition: "all 0.2s ease",
									backgroundColor: "#fff"
								}}
								onClick={() =>
									onEmailClick(emailEntry.email, index)
								}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor =
										"#f5f5f5";
									e.currentTarget.style.borderColor =
										emailEntry?.suppression?.suppressed
											? `red`
											: "#999";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor =
										"#fff";
									e.currentTarget.style.borderColor =
										emailEntry?.suppression?.suppressed
											? `red`
											: "#e0e0e0";
								}}
							>
								<div className="flex col gap-xs w-100">
									<span
										className="flex row a-ce j-sb gap-xs w-100"
										style={{ fontWeight: 600 }}
									>
										{emailEntry.email}
										{emailEntry?.suppression
											?.suppressed && (
											<StateDisplay
												label="Unterdrückt"
												color="red"
											/>
										)}
									</span>
									<div className="flex col gap-xxs">
										<span
											style={{
												fontSize: "0.85rem",
												color: "#666"
											}}
										>
											{projectListsCount > 0
												? `${projectListsCount} Listen (dieses Projekt)`
												: "Keine Listen (dieses Projekt)"}
										</span>
										{otherProjectListsCount > 0 && (
											<span
												style={{
													fontSize: "0.8rem",
													color: "#999",
													fontStyle: "italic"
												}}
											>
												+ {otherProjectListsCount}{" "}
												Listen (andere Projekte)
											</span>
										)}
									</div>
								</div>
								{/* <IconButton icon="chevron_right" /> */}
							</div>
						);
					})}
				</div>
			) : (
				<p
					style={{
						color: "#999",
						textAlign: "center",
						padding: "2rem 0"
					}}
				>
					Noch keine E-Mail-Adressen vorhanden
				</p>
			)}

			<Divider showLine size="small" />

			<IconButton
				icon="plus"
				onClick={onAddEmail}
				text="Neue E-Mail-Adresse hinzufügen"
			/>
		</div>
	);
};

export default EmailList;
