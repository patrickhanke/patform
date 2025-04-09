"use client";

import { generateGraphQLQuery } from "@repo/provider";
import { TableColumnCategoryProps } from "../types";
import "../styles.scss";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { ElementSelectInterface, SelectElement, SlideIn } from "@repo/ui";
import { Classes } from "@repo/types";

const TableColumnCategory = ({
	category,
	categories = [],
	onChange
}: TableColumnCategoryProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newCategories, setNewCategories] = useState<string[]>(
		categories || []
	);

	const fields = useMemo(() => {
		const fields = ["objectId", "label", category.key];
		if (category.connected_class === "Category") {
			fields.push("category_id");
		}
		return fields;
	}, [category]);

	const { data } = useQuery(
		generateGraphQLQuery({
			type: "find",
			objectName: category.connected_class,
			fields
		}),
		{
			variables: { params: { module: { _eq: category.moduleId } } }
		}
	);

	const elements = useMemo(() => {
		const categoryOptionsArray: SelectElement[] = [];
		if (data) {
			data.objects[`find${category.connected_class}`].results.forEach(
				(cat: Classes) => {
					if (category.category_ids.length > 0) {
						if (
							cat.category_id &&
							category.category_ids.includes(cat.category_id)
						) {
							categoryOptionsArray.push({
								value: cat.objectId,
								id: cat.objectId,
								label: `${cat.label}`,
								element: <p>{cat.label}</p>
							});
						}
					} else {
						categoryOptionsArray.push({
							value: cat.objectId,
							id: cat.objectId,
							label: `${cat.label}`,
							element: <div>{cat.label}</div>
						});
					}
				}
			);
		}
		categoryOptionsArray.sort((a, b) => a.label?.localeCompare(b.label));

		return categoryOptionsArray;
	}, [data]);

	const selectCategory = useMemo(
		() => (
			<ElementSelectInterface
				elements={elements}
				selectedElements={elements.filter((element) =>
					newCategories.includes(element.id)
				)}
				onSelect={(selectValue) => {
					if (!selectValue || selectValue.length === 0) {
						setNewCategories([]);
					} else if (selectValue.length > 0) {
						setNewCategories(selectValue.map((value) => value.id));
					}
				}}
				max={category.is_multi ? 6 : 1}
				isSearchable
			/>
		),
		[elements, categories, newCategories, data, onChange]
	);

	return (
		<>
			<div>
				{!categories || categories?.length === 0 ? (
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="full_button sm grey"
					>
						<span>+ Kategorie hinzufügen</span>
					</button>
				) : (
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="full_button sm light"
					>
						<span>
							{categories.map(
								(cat) =>
									elements.find(
										(element) => element.id === cat
									)?.label
							)}
						</span>
					</button>
				)}
			</div>
			<SlideIn
				isOpen={isOpen}
				cancel={() => setIsOpen(false)}
				confirm={async () => {
					setLoading(true);
					await onChange(newCategories);
					setIsOpen(false);
					setLoading(false);
				}}
				disabled={[loading, loading]}
				header="Kategorie auswählen"
			>
				{selectCategory}
			</SlideIn>
		</>
	);
};

export default TableColumnCategory;
