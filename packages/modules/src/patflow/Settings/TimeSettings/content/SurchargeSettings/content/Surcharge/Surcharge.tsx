import React from "react";
import { SurchargeComponentProps } from "./types";
import clsx from "clsx";
import surcharge_types from "../CreateSurcharge/constants/surcharge_types";
import { IconButton } from "@repo/ui";
import { getDateString } from "@repo/provider";
import "./styles.scss";

const Surcharge: React.FC<SurchargeComponentProps> = ({
	surcharge,
	setEditSurcharge,
	setDeleteSurcharge
}) => {
	return (
		<div className={clsx("content_element", "surcharge_element_container")}>
			<div className="surcharge_element_content">
				<div style={{ width: "200px" }}>
					<h3>{surcharge.title}</h3>
				</div>
				<div className="button_container" style={{ width: "120px" }}>
					<p className="label">Typ:</p>
					<p>
						{
							surcharge_types.find(
								(type) => type.value === surcharge.data?.type
							)?.label
						}
					</p>
				</div>
				<div className="button_container">
					<p className="label">Status:</p>
					<p>{surcharge.data?.active ? "Aktiv" : "Inaktiv"}</p>
				</div>
				<div className="button_container">
					<p className="label">Startdatum:</p>
					<p>
						{getDateString(
							new Date(surcharge.data?.start_date)
						).date}
					</p>
				</div>
				<div className="button_container">
					<p className="label">Enddatum:</p>
					<p>
						{surcharge.data?.end_date
							? getDateString(new Date(surcharge.data.end_date))
									.date
							: "-"}
					</p>
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
