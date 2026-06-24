import { FC } from "react";
import { HolidayTemplate } from "@repo/types";
import { Divider, ElementSelectInterface } from "@repo/ui";
import { CreateRecordSurchargesAndHolidaysProps } from "../types";
import styles from "../CreateRecord.module.scss";

const CreateRecordSurchargesAndHolidays: FC<
	CreateRecordSurchargesAndHolidaysProps
> = ({
	surcharges,
	surchargeElements,
	holidayTemplateElements,
	holidayTemplateData,
	nextRecord,
	setSurcharges,
	setNextRecord,
	isEditing = false
}) => (
	<div className={styles.step_content}>
		<h3>Zuschläge & Feiertage</h3>
		<Divider showLine={false} />
		<div className={styles.select_section}>
			<h4>Zuschläge</h4>
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
		<Divider showLine />
		<div className={styles.select_section}>
			<h4>Feiertag-Template</h4>
			{isEditing ? (
				<p className={styles.step_description}>
					{nextRecord.holiday_template?.name ??
						"Kein Feiertag-Template ausgewählt"}
				</p>
			) : (
				<>
					<ElementSelectInterface
						elements={holidayTemplateElements}
						selectedElements={
							nextRecord.holiday_template
								? holidayTemplateElements.filter(
										(e) =>
											e.value ===
											nextRecord.holiday_template
												?.objectId
									)
								: []
						}
						onSelect={(selected) => {
							const template = holidayTemplateData?.find(
								(t: HolidayTemplate) =>
									t.objectId === selected[0]?.value
							);
							setNextRecord((prev) => ({
								...prev,
								holiday_template: template ?? undefined
							}));
						}}
						max={1}
					/>
					{!nextRecord.holiday_template && (
						<p className={styles.validation_hint}>
							Bitte ein Feiertag-Template auswählen
						</p>
					)}
				</>
			)}
		</div>
	</div>
);

export default CreateRecordSurchargesAndHolidays;
