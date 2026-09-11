"use client";

import { FC, useMemo, useState } from "react";
import { Email, EmailStatus, Filter } from "@repo/types";
import { EmailRecipientsProps, TableData } from "./types";
import {
	Divider,
	PaginationState,
	Select,
	StateDisplay,
	Table,
	useCreateColumns
} from "@repo/ui";
import EmailRecipientState, {
	mapLettermintStatus
} from "./components/EmailRecipientState";
import { useFindData } from "@repo/provider";

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

const EmailRecipients: FC<EmailRecipientsProps> = ({ emailTemplateId }) => {
	const [suppressedFilter, setSuppressedFilter] =
		useState<SuppressedFilter>("all");
	const [statusFilter, setStatusFilter] = useState<EmailStatus | "all">(
		"all"
	);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const DEFAULT_FILTERS: Filter[] = [
		{
			key: "reference_id",
			operator: "equalTo",
			value: emailTemplateId
		}
	];

	const { data: emailData } = useFindData<Email>({
		objectName: "Email",
		fields: ["objectId", "state", "data", "sendAt"],
		filters: DEFAULT_FILTERS,
		pollInterval: 10000
	});

	console.log(emailData);

	const tableData: TableData[] = useMemo(() => {
		if (!emailData) return [];
		return emailData
			.map((email) => {
				return {
					last_name: email.data?.recipient?.last_name ?? "",
					first_name: email.data?.recipient?.first_name ?? "",
					title: email.data?.recipient?.title ?? "",
					email: email.data?.recipient?.email ?? "",
					suppressed: email.data?.suppressed ?? false,
					state: email.state ?? undefined,
					sendAt: email.sendAt ?? undefined,
					objectId: email.objectId
				};
			})
			.filter((data) => data !== null)
			.sort((a, b) => {
				return (a.last_name ?? "").localeCompare(b.last_name ?? "");
			});
	}, [emailData]);

	const filteredTableData = useMemo(() => {
		return tableData.filter((row) => {
			if (suppressedFilter === "yes" && !row.suppressed) return false;
			if (suppressedFilter === "no" && row.suppressed) return false;
			if (statusFilter !== "all") {
				const normalized = mapLettermintStatus(row.state ?? "unknown");
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
				id: "state",
				label: "Status",
				type: "custom",
				render: (row: TableData) => {
					return row.state ? (
						<EmailRecipientState status={row.state} />
					) : (
						"Nicht verfügbar"
					);
				}
			},
			{
				id: "sendAt",
				label: "Versanddatum",
				type: "string",
				render: (row: TableData) => {
					return row.sendAt
						? new Date(row.sendAt).toLocaleString("de-DE", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							})
						: "-";
				}
			}
		],
		refetch: () => null,
		categories: [],
		className: "Email",
		useMasterKey: true,
		editDisabled: false
	});

	if (!emailData || !emailData.length) {
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
			<Divider showLine />

			<Table
				columns={columns}
				data={filteredTableData}
				rowCount={filteredTableData.length}
				pagination={pagination}
				setPagination={setPagination}
			/>
		</div>
	);
};

export default EmailRecipients;
