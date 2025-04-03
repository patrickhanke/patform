"use client";

import { useEffect, useMemo } from "react";
import { RenderFiltersProps } from "./types";
import { ModuleCategory } from "@repo/types";
import FilterSelect from "./components/FilterSelect";
import "./styles.scss";
import { Select } from "../../Inputs";
import filterChangeHandler from "./functions/filterChangeHandler";
import { RefreshCcw } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

const RenderFilters = ({
	categories,
	filters = [],
	setFilters,
	initialFilters = [],
	fields = []
}: RenderFiltersProps) => {
	const [textInput, setTextInput] = useDebounceValue<{
		key: string;
		value: string;
	}>({ key: "", value: "" }, 1000);

	useEffect(() => {
		if (textInput.key) {
			setFilters(
				filterChangeHandler(
					textInput.key,
					textInput.value,
					"_regex",
					filters
				)
			);
		}
	}, [textInput, setFilters, filters]);

	const renderFilters = useMemo(() => {
		const filterArray: JSX.Element[] = [];
		fields?.forEach((field) => {
			if (field.type === "input") {
				filterArray.push(
					<input
						key={field.key}
						placeholder={field.placeholder || "Suchwort ..."}
						onChange={(e) =>
							setTextInput({
								key: field.key,
								value: e.target.value
							})
						}
					/>
				);
			} else if (field.type === "select") {
				filterArray.push(
					<Select
						key={field.key}
						label=""
						width="180px"
						options={field.options}
						value={field?.value || null}
						onChange={(value) =>
							setFilters(
								filterChangeHandler(
									field.key,
									value.value,
									"_in",
									filters
								)
							)
						}
						placeholder={field.placeholder}
						isClearable={false}
					/>
				);
			}
		});
		categories.forEach((category: ModuleCategory) => {
			if (category) {
				filterArray.push(
					<FilterSelect
						category={category}
						filters={filters}
						setFilters={setFilters}
					/>
				);
			}
		});
		return filterArray;
	}, [filters, setFilters, categories]);

	return (
		<div className="filter_container">
			<div className="button_container">{renderFilters}</div>
			<div>
				<button
					className="full_button primary md"
					onClick={() => setFilters(initialFilters)}
				>
					<span>
						<RefreshCcw
							size={12}
							style={{ transform: "translateY(2px)" }}
						/>
					</span>
				</button>
			</div>
		</div>
	);
};

export default RenderFilters;
