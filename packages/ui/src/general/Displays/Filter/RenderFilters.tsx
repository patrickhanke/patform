"use client";

import { useMemo } from "react";
import { RenderFiltersProps } from "./types";
import { ModuleCategory } from "@repo/types";
import FilterSelect from "./components/FilterSelect";
import "./styles.scss";
import { Select } from "../../Inputs";
import filterChangeHandler from "./functions/filterChangeHandler";
import { RefreshCcw } from "lucide-react";

const RenderFilters = ({
	categories,
	filters = [],
	setFilters,
	initialFilters = [],
	fields = []
}: RenderFiltersProps) => {
	const renderFilters = useMemo(() => {
		const filterArray: JSX.Element[] = [];
		fields?.forEach((field) => {
			if (field.type === "input") {
				filterArray.push(
					<input
						key={field.key}
						placeholder={field.placeholder || "Suchwort ..."}
						value={
							(filters.find((filter) => filter.key === field.key)
								?.value as string) || ""
						}
						onChange={(e) =>
							setFilters(
								filterChangeHandler(
									field.key,
									e.target.value,
									"_regex",
									filters
								)
							)
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
