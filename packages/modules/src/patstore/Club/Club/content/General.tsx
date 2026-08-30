"use client";

import { FC, useMemo } from "react";
import { ClubClass } from "@repo/types";
import { PatstoreSelectImages, TextInput, usePageData } from "@repo/ui";
import { ClubTabProps } from "../types";

const General: FC<ClubTabProps> = ({ related }) => {
	const { data: club, setData } = usePageData<ClubClass>();

	const shortErrors = useMemo(() => {
		const value = club?.short || "";
		const errors: string[] = [];
		const length = value.replace(/\s/g, "").length;
		if (value && length < 3) {
			errors.push("Dieses Kürzel ist zu kurz");
		}
		if (length > 7) {
			errors.push("Dieses Kürzel ist zu lang");
		}
		const duplicate = related.clubs.find(
			(item) =>
				item.objectId !== club?.objectId && item.short === value
		);
		if (value && duplicate) {
			errors.push("Dieses Kürzel existiert bereits");
		}
		return errors;
	}, [club?.objectId, club?.short, related.clubs]);

	if (!club) {
		return null;
	}

	return (
		<div className="flex row a-st j-sb gap-md" style={{ flexWrap: "wrap" }}>
			<div className="flex col a-st gap-sm">
				<TextInput
					id="title"
					label="Name"
					defaultValue={club.title || ""}
					onChange={(value) => setData("title", value)}
				/>
				<TextInput
					id="contact"
					label="Name Ansprechpartner"
					defaultValue={club.contact || ""}
					onChange={(value) => setData("contact", value)}
				/>
				<TextInput
					id="email"
					label="E-Mail"
					defaultValue={club.email || ""}
					onChange={(value) => setData("email", value)}
				/>
				<TextInput
					id="homepage"
					label="Homepage"
					defaultValue={club.homepage || ""}
					onChange={(value) => setData("homepage", value)}
				/>
				<TextInput
					id="short"
					label="Kürzel"
					defaultValue={club.short || ""}
					onChange={(value) => setData("short", value)}
				/>
				{shortErrors.length === 0 && club.short ? (
					<p>Dieses Kürzel ist gut</p>
				) : (
					shortErrors.map((error) => <p key={error}>{error}</p>)
				)}
			</div>
			<div className="flex col a-st gap-sm">
				<label>Logo</label>
				<PatstoreSelectImages
					image={club.logo || ""}
					maxFileCount={1}
					onChange={(image) =>
						setData(
							"logo",
							Array.isArray(image) ? image[0] || "" : image
						)
					}
				/>
			</div>
		</div>
	);
};

export default General;
