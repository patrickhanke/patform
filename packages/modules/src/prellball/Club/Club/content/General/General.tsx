"use client";

import { FC, useState } from "react";
import { useContext } from "react";
import { Parse, PatstoreAppContext, canUpdateRecord } from "@repo/provider";
import { TextInput, usePageData } from "@repo/ui";
import { ParseFileValue, PrellballClubClass } from "@repo/types";
import UnionClubSelection from "./components/UnionClubSelection";

const replaceUmlaute = (fileName: string) =>
	fileName
		.replace(/ä/g, "ae")
		.replace(/Ä/g, "Ae")
		.replace(/ö/g, "oe")
		.replace(/Ö/g, "Oe")
		.replace(/ü/g, "ue")
		.replace(/Ü/g, "Ue")
		.replace(/ß/g, "ss");

const General: FC<{
	clubs: PrellballClubClass[];
	/** Spielgemeinschaft: two regular clubs instead of contact data. */
	union?: boolean;
}> = ({ clubs, union = false }) => {
	const { data: club, setData } = usePageData<PrellballClubClass>();
	const { user, userRole, currentModule } = useContext(PatstoreAppContext);
	const [uploading, setUploading] = useState(false);
	console.log(club);
	if (!club) return null;

	// Role with update rights on the module or a grant for this club, or a
	// per-user page grant for this club.
	const roleCanEdit =
		Boolean(userRole?.objectId && currentModule) &&
		canUpdateRecord([userRole], currentModule, club.objectId);

	const canEdit = Boolean(user?.is_superuser) || roleCanEdit;

	const primaryId = club.settings?.primary_club_id || "";
	const secondaryId = club.settings?.secondary_club_id || "";
	const unionComplete = Boolean(primaryId && secondaryId);

	const locked = union && !unionComplete;

	const shortValue = club.settings?.short || "";
	const shortLength = shortValue.replace(/\s/g, "").length;
	const duplicate = clubs.find(
		(item) =>
			item.objectId !== club.objectId &&
			item.settings?.short &&
			item.settings?.short === shortValue
	);
	const shortError =
		shortValue && shortLength < 3
			? "Dieses Kürzel ist zu kurz"
			: shortLength > 7
				? "Dieses Kürzel ist zu lang"
				: duplicate
					? "Dieses Kürzel existiert bereits"
					: "";

	const uploadLogo = async (file: File) => {
		setUploading(true);
		try {
			const parseFile = new Parse.File(replaceUmlaute(file.name), file);
			await parseFile.save();
			const next: ParseFileValue = {
				__type: "File",
				name: parseFile.name() || file.name,
				url: parseFile.url() || ""
			};
			setData("file", next);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex col a-st gap-md" style={{ flexWrap: "wrap" }}>
			<div className="content_element">
				{union && (
					<UnionClubSelection
						club={club}
						clubs={clubs}
						primaryId={primaryId}
						secondaryId={secondaryId}
						setData={setData}
						disabled={!canEdit}
					/>
				)}
			</div>
			<div className="flex col a-st gap-sm">
				<TextInput
					id="club-title"
					label="Name"
					defaultValue={club.title}
					disabled={locked || !canEdit}
					onChange={(value) => setData("title", value)}
				/>
				{!union && (
					<>
						<TextInput
							id="club-contact"
							label="Name Ansprechpartner"
							defaultValue={club.settings?.contact || ""}
							disabled={locked || !canEdit}
							onChange={(value) =>
								setData("settings.contact", value)
							}
						/>
						<TextInput
							id="club-email"
							label="E-Mail"
							defaultValue={club.settings?.email || ""}
							disabled={locked || !canEdit}
							onChange={(value) =>
								setData("settings.email", value)
							}
						/>
						<TextInput
							id="club-homepage"
							label="Homepage"
							defaultValue={club.settings?.homepage || ""}
							disabled={locked || !canEdit}
							onChange={(value) =>
								setData("settings.homepage", value)
							}
						/>
					</>
				)}
				<TextInput
					id="club-short"
					label="Kürzel"
					defaultValue={shortValue}
					disabled={!user?.is_superuser || locked}
					onChange={(value) => setData("settings.short", value)}
				/>
				{shortError ? <p>{shortError}</p> : null}
				{shortValue && !shortError ? (
					<p>Dieses Kürzel ist gut</p>
				) : null}
			</div>

			<div className="flex col a-st gap-sm">
				<label htmlFor="club-logo">Logo</label>
				{club.file?.url ? (
					<img
						src={club.file.url}
						alt={club.title}
						style={{
							width: 120,
							height: 120,
							objectFit: "contain"
						}}
					/>
				) : null}
				<input
					id="club-logo"
					type="file"
					accept="image/*"
					disabled={uploading || locked}
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file) uploadLogo(file);
					}}
				/>
				{club.file ? (
					<button
						type="button"
						className="full_button sm light"
						disabled={locked}
						onClick={() => setData("file", null)}
					>
						Logo entfernen
					</button>
				) : null}
			</div>
		</div>
	);
};

export default General;
