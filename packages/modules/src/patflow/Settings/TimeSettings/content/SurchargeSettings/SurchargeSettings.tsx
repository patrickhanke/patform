import { useDataHandler, useFindData } from "@repo/provider";
import { Surcharge as SurchargeType } from "@repo/types";
import React, { useCallback, useState } from "react";
import Surcharge from "./content/Surcharge";
import CreateSurcharge from "./content/CreateSurcharge";
import { cloneDeep } from "lodash-es";
import ArchiveSurcharge from "./components/ArchiveSurcharge";
import { SurchargeSettingsProps } from "./types";
import { CreateButton, Divider } from "@repo/ui";

const SurchargeSettings: React.FC<SurchargeSettingsProps> = ({
	projectId,
	holidays
}) => {
	const { updateData, createData } = useDataHandler();
	const [createSurcharge, setCreateSurcharge] = useState(false);
	const [editSurcharge, setEditSurcharge] = useState<SurchargeType | null>(
		null
	);

	console.log(editSurcharge);

	const [deleteSurcharge, setDeleteSurcharge] =
		useState<SurchargeType | null>(null);

	const { data, loading, refetch } = useFindData({
		objectName: "Surcharge",
		fields: [
			"objectId",
			"name",
			"createdAt",
			"active",
			"type",
			"time_value",
			"day_value",
			"work_value",
			"value",
			"start_date",
			"end_date",
			"connected_records",
			"color",
			"short",
			"description"
		],
		projectId: projectId
	});

	const updateSurchargeHandler = useCallback(
		async (surcharge: SurchargeType) => {
			if (surcharge.objectId && surcharge.objectId.length > 0) {
				const surchargeCopy: Partial<SurchargeType> =
					cloneDeep(surcharge);
				await updateData({
					className: "Surcharge",
					objectId: surcharge.objectId,
					updateObject: {
						name: surchargeCopy.name,
						type: surchargeCopy.type,
						time_value: surchargeCopy.time_value,
						day_value: surchargeCopy.day_value,
						work_value: surchargeCopy.work_value,
						value: surchargeCopy.value,
						start_date: surchargeCopy.start_date,
						color: surchargeCopy.color,
						short: surchargeCopy.short,
						description: surchargeCopy.description
					}
				});
			} else {
				await createData({
					className: "Surcharge",
					updateObject: {
						...surcharge,
						project: {
							__type: "Pointer",
							className: "Project",
							objectId: projectId
						}
					}
				});
			}

			await refetch();
		},
		[data]
	);

	if (loading) {
		return null;
	}

	const activeSurcharges: SurchargeType[] = [];
	const inActiveSurcharges: SurchargeType[] = [];

	data?.forEach((surcharge: SurchargeType) => {
		if (surcharge.active === true) {
			activeSurcharges.push(surcharge);
		} else {
			inActiveSurcharges.push(surcharge);
		}
	});

	const surchargeArray: SurchargeType[] = [];
	data?.forEach((surcharge: SurchargeType) => {
		const startDate = new Date(surcharge.start_date).getTime();
		const endDate = surcharge.end_date
			? new Date(surcharge.end_date).getTime()
			: Infinity;
		const recordDate = new Date("2024-10-01").getTime();

		if (
			isNaN(startDate) ||
			isNaN(recordDate) ||
			(surcharge.end_date && isNaN(endDate))
		) {
			// throw new Error('Invalid date format');
			return;
		}

		if (startDate <= recordDate && endDate >= recordDate) {
			surchargeArray.push(surcharge);
		}
	});

	return (
		<div>
			<Divider text="Aktive Zuschläge" />
			{activeSurcharges.length > 0 ? (
				<div className="vertical_container">
					{activeSurcharges.map((surcharge) => (
						<Surcharge
							key={surcharge.objectId}
							surcharge={surcharge}
							updateSurchargeHandler={updateSurchargeHandler}
							setEditSurcharge={setEditSurcharge}
							setDeleteSurcharge={setDeleteSurcharge}
							refetch={refetch}
						/>
					))}
				</div>
			) : (
				<p>Keine aktiven Zuschläge</p>
			)}
			<div style={{ marginTop: 24 }}>
				<CreateButton
					size="medium"
					text="Neuen Zuschlag erstellen"
					onClick={() => setCreateSurcharge(true)}
				/>
			</div>
			<Divider text="" size="large" showLine={false} />
			<Divider text="Inaktive Zuschläge" />
			<div>
				{inActiveSurcharges.length > 0 ? (
					<div className="vertical_container gap-md">
						{inActiveSurcharges.map((surcharge) => (
							<Surcharge
								key={surcharge.objectId}
								surcharge={surcharge}
								updateSurchargeHandler={updateSurchargeHandler}
								setEditSurcharge={setEditSurcharge}
								setDeleteSurcharge={setDeleteSurcharge}
								refetch={refetch}
							/>
						))}
					</div>
				) : (
					<p> Keine inaktiven Zuschläge</p>
				)}
			</div>
			<CreateSurcharge
				surcharge={editSurcharge}
				createSurcharge={createSurcharge}
				setCreateSurcharge={setCreateSurcharge}
				updateSurchargeHandler={updateSurchargeHandler}
				setEditSurcharge={setEditSurcharge}
				holidays={holidays}
			/>
			<ArchiveSurcharge
				deleteSurcharge={deleteSurcharge}
				setDeleteSurcharge={setDeleteSurcharge}
				refetch={refetch}
			/>
		</div>
	);
};

export default SurchargeSettings;
