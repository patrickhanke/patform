"use client";

import { FC, useState } from "react";
import { useContext } from "react";
import { Parse, PatstoreAppContext } from "@repo/provider";
import { TextInput, usePageData } from "@repo/ui";
import { ParseFileValue, PrellballClubClass } from "@repo/types";

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
}> = ({ clubs }) => {
	const { data: club, setData } = usePageData<PrellballClubClass>();
	const { user } = useContext(PatstoreAppContext);
	const [uploading, setUploading] = useState(false);
	if (!club) return null;

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
		<div className="flex row a-st gap-md" style={{ flexWrap: "wrap" }}>
			<div className="flex col a-st gap-sm">
				<TextInput
					id="club-title"
					label="Name"
					defaultValue={club.title}
					onChange={(value) => setData("title", value)}
				/>
				<TextInput
					id="club-contact"
					label="Name Ansprechpartner"
					defaultValue={club.settings?.contact || ""}
					onChange={(value) => setData("settings.contact", value)}
				/>
				<TextInput
					id="club-email"
					label="E-Mail"
					defaultValue={club.settings?.email || ""}
					onChange={(value) => setData("settings.email", value)}
				/>
				<TextInput
					id="club-homepage"
					label="Homepage"
					defaultValue={club.settings?.homepage || ""}
					onChange={(value) => setData("settings.homepage", value)}
				/>
				<TextInput
					id="club-short"
					label="Kürzel"
					defaultValue={shortValue}
					disabled={!user?.is_superuser}
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
					disabled={uploading}
					onChange={(event) => {
						const file = event.target.files?.[0];
						if (file) uploadLogo(file);
					}}
				/>
				{club.file ? (
					<button
						type="button"
						className="full_button sm light"
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
