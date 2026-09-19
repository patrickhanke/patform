import {
	useDataHandler,
	useFindData,
	surchargeItemFields,
	surchargeItemFilters,
	remapSurchargeDayValue
} from "@repo/provider";
import { Surcharge as SurchargeType } from "@repo/types";
import React, { useCallback, useState } from "react";
import Surcharge from "./content/Surcharge";
import CreateSurcharge from "./content/CreateSurcharge";
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

	const [deleteSurcharge, setDeleteSurcharge] =
		useState<SurchargeType | null>(null);

	const { data, loading, refetch } = useFindData({
		objectName: "Item",
		fields: surchargeItemFields,
		filters: surchargeItemFilters,
		projectId: projectId
	});

	const updateSurchargeHandler = useCallback(
		async (surcharge: SurchargeType) => {
			const dataPayload = {
				...surcharge.data,
				kind: "surcharge" as const,
				day_value: remapSurchargeDayValue(
					surcharge.data?.day_value,
					holidays
				)
			};
			const updateObject = {
				title: surcharge.title,
				label: dataPayload.short || surcharge.title,
				date: dataPayload.start_date || surcharge.date,
				description: surcharge.description,
				reference_id: "surcharge",
				data: dataPayload
			};
			if (surcharge.objectId && surcharge.objectId.length > 0) {
				await updateData({
					className: "Item",
					objectId: surcharge.objectId,
					updateObject
				});
			} else {
				await createData({
					className: "Item",
					updateObject
				});
			}

			await refetch();
		},
		[createData, holidays, refetch, updateData]
	);

	if (loading) {
		return null;
	}

	const items = (data || []) as SurchargeType[];
	const activeSurcharges: SurchargeType[] = [];
	const inActiveSurcharges: SurchargeType[] = [];

	items.forEach((surcharge) => {
		if (surcharge.data?.active === true) {
			activeSurcharges.push(surcharge);
		} else {
			inActiveSurcharges.push(surcharge);
		}
	});

	const surchargeArray: SurchargeType[] = [];
	items.forEach((surcharge) => {
		const startDate = new Date(surcharge.data?.start_date).getTime();
		const endDate = surcharge.data?.end_date
			? new Date(surcharge.data.end_date).getTime()
			: Infinity;
		const recordDate = new Date("2024-10-01").getTime();

		if (
			isNaN(startDate) ||
			isNaN(recordDate) ||
			(surcharge.data?.end_date && isNaN(endDate))
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
