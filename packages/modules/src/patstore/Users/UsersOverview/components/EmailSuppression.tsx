import { FC, useCallback, useState } from "react";
import { Divider, Modal } from "@repo/ui";
import { axiosclient, useDataContext } from "@repo/provider";
import { EmailSuppressionProps } from "../types";
import { PatstoreUser } from "@repo/types";
import { Button, HStack } from "@chakra-ui/react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SuppressedEmailRow = PatstoreUser["emails"][number] & { label: string };

const sortByLabel = (rows: SuppressedEmailRow[]): SuppressedEmailRow[] =>
	[...rows].sort((a, b) =>
		a.label.localeCompare(b.label, "de", { sensitivity: "base" })
	);

const exportFilenameBase = () =>
	`email-unterdrueckungen_${new Date().toISOString().split("T")[0]}`;

const downloadCsv = (rows: SuppressedEmailRow[]) => {
	const sorted = sortByLabel(rows);
	const data = sorted.map((row) => ({
		Name: row.label,
		"E-Mail": row.email,
		Listen: row.lists.join("; "),
		Unterdrückt: row.suppression.suppressed ? "Ja" : "Nein",
		Grund: row.suppression.reason ?? ""
	}));
	const csv = Papa.unparse(data, { header: true });
	const blob = new Blob(["\uFEFF" + csv], {
		type: "text/csv;charset=utf-8;"
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${exportFilenameBase()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};

const downloadPdf = (rows: SuppressedEmailRow[]) => {
	const sorted = sortByLabel(rows);
	const body = sorted.map((row) => [
		row.label,
		row.email,
		row.lists.join("; "),
		row.suppression.suppressed ? "Ja" : "Nein",
		row.suppression.reason ?? "—"
	]);
	const doc = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4"
	});
	doc.setFontSize(16);
	doc.text("Unterdrückte E-Mail-Adressen", 14, 15);
	autoTable(doc, {
		startY: 22,
		head: [["Name", "E-Mail", "Listen", "Unterdrückt", "Grund"]],
		body,
		styles: { fontSize: 9, cellPadding: 2 },
		headStyles: {
			fillColor: [66, 139, 202],
			textColor: [255, 255, 255],
			fontStyle: "bold"
		},
		columnStyles: {
			0: { cellWidth: 35 },
			1: { cellWidth: 45 },
			2: { cellWidth: 30 },
			3: { cellWidth: 22 },
			4: { cellWidth: 38 }
		},
		alternateRowStyles: { fillColor: [245, 245, 245] },
		margin: { left: 14, right: 14 }
	});
	doc.save(`${exportFilenameBase()}.pdf`);
};

const EmailSuppression: FC<EmailSuppressionProps> = ({
	isOpen,
	setIsOpen,
	projectId
}) => {
	const [loading, setLoading] = useState(false);
	const [emailAddresses, setEmailAddresses] = useState<SuppressedEmailRow[]>(
		[]
	);
	const { feedbackHandler } = useDataContext();
	const checkEmailAddresses = useCallback(async () => {
		setLoading(true);
		const response = await axiosclient()
			.post("/functions/check_email_suppressions", {
				project_id: projectId
			})
			.catch((error) => {
				console.log(error);
				feedbackHandler({
					success: false,
					message: "Fehler beim Prüfen der E-Mail Adressen",
					type: "error"
				});
				setLoading(false);
				return null;
			});
		if (!response) return;
		setEmailAddresses(response.data.result);
		setLoading(false);
	}, [projectId]);

	return (
		<Modal
			header="E-Mail Adressen prüfen"
			isOpen={isOpen}
			cancelButtonHandler={() => setIsOpen(false)}
			buttonDisabled={[loading, false]}
			loading={loading}
		>
			<p>
				Hier können Sie die E-Mail Adressen prüfen, die im E-Mail Modul
				der Nutzer hinterlegt sind. Falls eine E-Mail Adresse fehlerhaft
				ist, wird sie mit einem entsprechenden Hinweis hinterlegt.
			</p>
			<Divider showLine={false} />
			<Button
				type="button"
				className="full_button md primary"
				onClick={checkEmailAddresses}
				loading={loading}
			>
				E-Mail Adressen prüfen
			</Button>
			<Divider />
			<HStack gap={3} mt={4} flexWrap="wrap">
				<Button
					type="button"
					className="full_button md secondary"
					onClick={() => downloadCsv(emailAddresses)}
					disabled={loading || emailAddresses.length === 0}
				>
					Als CSV herunterladen
				</Button>
				<Button
					type="button"
					className="full_button md secondary"
					onClick={() => downloadPdf(emailAddresses)}
					disabled={loading || emailAddresses.length === 0}
				>
					Als PDF herunterladen
				</Button>
			</HStack>
		</Modal>
	);
};

export default EmailSuppression;
