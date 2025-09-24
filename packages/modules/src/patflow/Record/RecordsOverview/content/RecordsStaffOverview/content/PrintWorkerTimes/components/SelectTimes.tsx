import { Icon } from "@repo/ui";
import { SelectTimesProps, YearOptions } from "../types";
import { useMemo, FC } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import customStyles from "../constants/selectCustomStyles";
import { months } from "@repo/provider";

const SelectTimes: FC<SelectTimesProps> = ({
	selectedTimes,
	setSelectedTimes
}) => {
	const yearOptions: YearOptions = useMemo(() => {
		const options: YearOptions = [];
		for (
			let i = new Date().getFullYear() - 1;
			i <= new Date().getFullYear() + 1;
			i += 1
		) {
			options.push({
				value: i,
				label: i.toString()
			});
		}
		return options;
	}, []);

	return (
		<div className="vertical_container gap-md">
			<div className="horizontal_container">
				<div className="horizontal_container">
					<Icon type="calendar" size={12} />
					<p className="label">Jahr</p>
				</div>
				<ReactSelect<YearOptions[number]>
					options={yearOptions}
					onChange={(value) => {
						if (!value) {
							return;
						}
						setSelectedTimes({
							year: value.value as number,
							month: selectedTimes.month
						});
					}}
					styles={
						customStyles({ width: 120 }) as StylesConfig<
							YearOptions[number]
						>
					}
					isClearable={false}
					value={
						yearOptions.find(
							(option) => option.value === selectedTimes.year
						) || {
							value: selectedTimes.year,
							label: selectedTimes.year.toString()
						}
					}
				/>
			</div>
			<div className="horizontal_container">
				<div className="horizontal_container">
					<Icon type="calendar" size={12} />
					<p className="label">Monat</p>
				</div>
				<ReactSelect<(typeof months)[number]>
					options={months}
					onChange={(value) => {
						if (!value) {
							return;
						}
						setSelectedTimes({
							year: selectedTimes.year,
							month: value.id
						});
					}}
					styles={
						customStyles({ width: 120 }) as StylesConfig<
							(typeof months)[number]
						>
					}
					isClearable={false}
					value={months.find(
						(option) => option.id === selectedTimes.month
					)}
				/>
			</div>
		</div>
	);
};

export default SelectTimes;
