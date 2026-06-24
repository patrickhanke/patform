import { FC } from "react";
import { Divider, ElementSelectInterface } from "@repo/ui";
import { CreateRecordSurchargesAndHolidaysProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordSurchargesAndHolidays: FC<
	CreateRecordSurchargesAndHolidaysProps
> = ({
	surcharges,
	surchargeElements,
	setSurcharges,
	setNextRecord,
	isEditing = false
}) => (
	<div className={styles.step_content}>
		<h3>Zuschläge</h3>
		<Divider showLine={false} />
		<div className={styles.select_section}>
			{isEditing ? (
				<p className={styles.step_description}>
					{surchargeElements
						.filter((e) => surcharges.includes(e.value as string))
						.map((e) => e.label)
						.join(", ") || "Keine Zuschläge ausgewählt"}
				</p>
			) : (
				<ElementSelectInterface
					elements={surchargeElements}
					selectedElements={surchargeElements.filter((e) =>
						surcharges.includes(e.value as string)
					)}
					onSelect={(selected) => {
						const ids = selected.map((e) => e.value as string);
						setSurcharges(ids);
						setNextRecord((prev) => ({
							...prev,
							surcharges: ids
						}));
					}}
					max={100}
				/>
			)}
		</div>
	</div>
);

export default CreateRecordSurchargesAndHolidays;
