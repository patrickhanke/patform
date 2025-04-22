"use client";

import { generateGraphQLQuery } from "@repo/provider";
import { TableColumnCategoryProps } from "../types";
import "../styles.scss";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
	ElementSelectInterface,
	SelectElement,
	SlideIn,
	StateDisplay
} from "@repo/ui";
import { Classes } from "@repo/types";

const TableColumnCategory = ({
	category,
	categories = [],
	isEditable,
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
			fields.push("description");
			fields.push("color");
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
			variables: { params: { module: { _eq: category.moduleId } } },
			fetchPolicy: "cache-first"
		}
	);

	console.log({ newCategories });

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
								color: cat.color || "grey",
								element: (
									<div>
										<h4>{cat.label}</h4>
										{cat.description && (
											<p>{cat.description}</p>
										)}
									</div>
								)
							});
						}
					} else {
						categoryOptionsArray.push({
							value: cat.objectId,
							id: cat.objectId,
							label: `${cat.label}`,
							element: (
								<div>
									<h4>{cat.label}</h4>
									{cat.description && (
										<p>{cat.description}</p>
									)}
								</div>
							)
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
						const newCategoriesArray = [...categories].filter(
							(category) =>
								!elements.find(
									(element) => element.id === category
								)
						);

						setNewCategories(newCategoriesArray);
					} else if (selectValue.length > 0) {
						const newCategoriesArray: string[] = [
							...categories
						].filter(
							(category) =>
								!elements.find(
									(element) => element.id === category
								)
						);

						const newIds: string[] = selectValue.map(
							(value: SelectElement) => value.id
						) as string[];

						setNewCategories([...newCategoriesArray, ...newIds]);
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
			<div style={{ width: "180px" }}>
				{!categories ||
				categories?.length === 0 ||
				!categories.some((catId) =>
					elements.some((element) => element.id === catId)
				) ? (
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="full_button sm grey"
						disabled={!isEditable}
					>
						<span>+ Kategorie hinzufügen</span>
					</button>
				) : (
					<div
						onClick={() => setIsOpen(true)}
						className="flex row gap-sm"
					>
						<span>
							{categories.map((catId) => {
								const category = elements.find(
									(element) => element.id === catId
								);
								if (category) {
									return (
										<StateDisplay
											key={catId}
											label={category.label}
											color={category.color}
										/>
									);
								}
								return null;
							})}
						</span>
					</div>
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
