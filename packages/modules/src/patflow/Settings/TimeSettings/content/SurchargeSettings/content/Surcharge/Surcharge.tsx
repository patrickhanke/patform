import React from "react";
import { SurchargeComponentProps } from "./types";
import clsx from "clsx";
import surcharge_types from "../CreateSurcharge/constants/surcharge_types";
import { IconButton } from "@repo/ui";
import { getDateString } from "@repo/provider";
import RecordSelect from "./components/RecordSelect";
import "./styles.scss";

const Surcharge: React.FC<SurchargeComponentProps> = ({
	surcharge,
	setEditSurcharge,
	setDeleteSurcharge,
	refetch
}) => {
	return (
		<div className={clsx("content_element", "surcharge_element_container")}>
			<div className="surcharge_element_content">
				<div style={{ width: "200px" }}>
					<h3>{surcharge.name}</h3>
				</div>
				<div className="button_container" style={{ width: "120px" }}>
					<p className="label">Typ:</p>
					<p>
						{
							surcharge_types.find(
								(type) => type.value === surcharge.type
							)?.label
						}
					</p>
				</div>
				<div className="button_container">
					<p className="label">Status:</p>
					<p>{surcharge.active ? "Aktiv" : "Inaktiv"}</p>
				</div>
				<div className="button_container">
					<p className="label">Startdatum:</p>
					<p>{getDateString(new Date(surcharge.start_date)).date}</p>
				</div>
				<div className="button_container">
					<p className="label">Enddatum:</p>
					<p>
						{surcharge.end_date
							? getDateString(new Date(surcharge.end_date)).date
							: "-"}
					</p>
				</div>
				<div>
					<RecordSelect
						initialSelectedRecords={surcharge.connected_records}
						surchargeId={surcharge.objectId}
						refetch={refetch}
					/>
				</div>
				<div className="button_container">
					<IconButton
						icon="edit"
						onClick={() => {
							setEditSurcharge(surcharge);
						}}
					/>
					<IconButton
						icon="archive"
						onClick={() => {
							setDeleteSurcharge(surcharge);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Surcharge;
