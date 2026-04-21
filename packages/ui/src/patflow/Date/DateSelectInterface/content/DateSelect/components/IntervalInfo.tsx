import "../date_select.scss";
import { IntervalInfoProps } from "../types";
import { getDateString } from "@repo/provider";

const IntervalInfo = ({ dates }: IntervalInfoProps) => {
	return (
		<div className={"interval_info_container"}>
			<label>Terminvorschau</label>
			<div className={"interval_info_content"}>
				{dates.map((date) => (
					<div key={date} className={"interval_info_element"}>
						<p>
							{getDateString(date).date} -{" "}
							{getDateString(date).time}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default IntervalInfo;
