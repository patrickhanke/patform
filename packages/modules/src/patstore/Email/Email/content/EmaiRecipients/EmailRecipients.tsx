"use client";

import { FC, useMemo, useState } from "react";
import { EmailStatus } from "@repo/types";
import { EmailRecipientsProps, TableData } from "./types";
import { Select, StateDisplay, Table, useCreateColumns } from "@repo/ui";
import EmailRecipientState, {
	mapLettermintStatus
} from "./components/EmailRecipientState";

type SuppressedFilter = "all" | "yes" | "no";

const STATUS_FILTER_OPTIONS: { value: EmailStatus | "all"; label: string }[] = [
	{ value: "all", label: "Alle Status" },
	{ value: "sent", label: "Gesendet" },
	{ value: "delivered", label: "Zugestellt" },
	{ value: "opened", label: "Geöffnet" },
	{ value: "clicked", label: "Geklickt" },
	{ value: "bounced", label: "Bounce" },
	{ value: "complained", label: "Spam-Beschwerde" },
	{ value: "unsubscribed", label: "Abgemeldet" },
	{ value: "failed", label: "Fehlgeschlagen" },
	{ value: "pending", label: "Ausstehend" },
	{ value: "unknown", label: "Unbekannt" }
];

const SUPPRESSED_FILTER_OPTIONS: {
	value: SuppressedFilter;
	label: string;
}[] = [
	{ value: "all", label: "Alle" },
	{ value: "yes", label: "Unterdrückt" },
	{ value: "no", label: "Nicht unterdrückt" }
];

const EmailRecipients: FC<EmailRecipientsProps> = ({
	email,
	recipients = [],
	emailRecipients = []
}) => {
	const [suppressedFilter, setSuppressedFilter] =
		useState<SuppressedFilter>("all");
	const [statusFilter, setStatusFilter] = useState<EmailStatus | "all">(
		"all"
	);

	const tableData: TableData[] = useMemo(() => {
		return recipients
			.map((recipient) => {
				const emailRecipient = emailRecipients.find(
					(emailRecipient) =>
						emailRecipient.userId === recipient.userId
				);
				return {
					last_name: recipient.data?.last_name ?? "",
					first_name: recipient.data?.first_name ?? "",
					title: recipient.data?.title ?? "",
					email: recipient.email,
					suppressed: recipient.suppressed,
					status: emailRecipient?.status ?? undefined
				};
			})
			.filter((data) => data !== null)
			.sort((a, b) => {
				return (a.last_name ?? "").localeCompare(b.last_name ?? "");
			});
	}, [recipients, emailRecipients]);

	const filteredTableData = useMemo(() => {
		return tableData.filter((row) => {
			if (suppressedFilter === "yes" && !row.suppressed) return false;
			if (suppressedFilter === "no" && row.suppressed) return false;
			if (statusFilter !== "all") {
				const normalized = mapLettermintStatus(row.status ?? "unknown");
				if (normalized !== statusFilter) return false;
			}
			return true;
		});
	}, [tableData, suppressedFilter, statusFilter]);
	const columns = useCreateColumns<TableData>({
		data: [
			{
				id: "title",
				label: "Anrede",
				type: "string"
			},
			{
				id: "last_name",
				label: "Nachname",
				type: "string"
			},
			{
				id: "first_name",
				label: "Vorname",
				type: "string"
			},
			{
				id: "email",
				label: "Email",
				type: "string"
			},
			{
				id: "suppressed",
				label: "Unterdrückt",
				type: "custom",
				render: (row: TableData) => {
					return (
						<StateDisplay
							label={!row.suppressed ? "Nein" : "Ja"}
							color={!row.suppressed ? "green" : "red"}
						/>
					);
				}
			},
			{
				id: "status",
				label: "Status",
				type: "custom",
				render: (row: TableData) => {
					return row.status ? (
						<EmailRecipientState status={row.status} />
					) : (
						"Nicht verfügbar"
					);
				}
			}
		],
		refetch: () => null,
		categories: [],
		className: "User",
		useMasterKey: true,
		editDisabled: true
	});

	if (!email || !recipients.length) {
		return (
			<div className="flex col gap-md">
				<h3>Empfänger</h3>
				<p>Keine Empfänger vorhanden</p>
			</div>
		);
	}

	const filterActive = suppressedFilter !== "all" || statusFilter !== "all";
	const headingCount = filterActive
		? `${filteredTableData.length} / ${tableData.length}`
		: String(tableData.length);

	return (
		<div className="flex col gap-md">
			<div className="flex row a-fe j-sb gap-md wrap">
				<Select
					id="email-recipients-suppressed-filter"
					label="Unterdrückung"
					width={200}
					options={SUPPRESSED_FILTER_OPTIONS}
					value={suppressedFilter}
					onChange={(option) =>
						setSuppressedFilter(
							(option?.value as SuppressedFilter) ?? "all"
						)
					}
				/>
				<Select
					id="email-recipients-status-filter"
					label="Versandstatus"
					width={220}
					options={STATUS_FILTER_OPTIONS}
					value={statusFilter}
					onChange={(option) =>
						setStatusFilter(
							(option?.value as EmailStatus | "all") ?? "all"
						)
					}
				/>
				<h3>Empfänger ({headingCount})</h3>
			</div>

			<Table
				columns={columns}
				data={filteredTableData}
				rowCount={filteredTableData.length}
			/>
		</div>
	);
};

export default EmailRecipients;
