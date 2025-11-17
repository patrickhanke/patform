"use client";

import { FC, Fragment, useCallback, useMemo, useState } from "react";
import ListElement from "./components/ListElement";
import { ElementSelectInterfaceProps, SelectElement } from "./types";
import { cloneDeep, get, set } from "lodash-es";
import { Divider } from "../../Layout";
import "./styles.scss";

const ElementSelectInterface: FC<ElementSelectInterfaceProps> = ({
	title = "",
	elements = [],
	selectedElements,
	onSelect,
	max = 1,
	isSearchable = false,
	selectProperty = false,
	useTiles = false,
	selectAll = false
}) => {
	const [searchInput, setSearchTerm] = useState("");

	const elementChangeHandler = useCallback(
		(element: SelectElement[number]) => {
			const elementsCopy = cloneDeep(selectedElements);

			if (selectProperty) {
				const elementIndex = elementsCopy.findIndex(
					(el) => el?.value === element.value
				);
				if (elementIndex !== -1) {
					const elementSelectValue = get(
						elementsCopy,
						`[${elementIndex}].selected`,
						false
					);
					set(
						elementsCopy,
						`[${elementIndex}].selected`,
						!elementSelectValue
					);
				}
				onSelect(elementsCopy);
			} else {
				const isSelected = !!elementsCopy.find(
					(el) => el.value === element.value
				);
				if (isSelected) {
					if (element.single) {
						onSelect([]);
					} else {
						const newElements = elementsCopy.filter(
							(el) => el.value !== element.value
						);
						onSelect(newElements);
					}
				}

				if (isSelected === false) {
					if (element.single) {
						onSelect([element]);
					} else {
						if (elementsCopy.length < max) {
							elementsCopy.push(element);

							const newElements = elementsCopy.filter(
								(el) => !el.single
							);
							onSelect(newElements);
						}
						if (elementsCopy.length === max) {
							elementsCopy.shift();
							elementsCopy.push(element);
							const newElements = elementsCopy.filter(
								(el) => !el.single
							);

							onSelect(newElements);
						}
					}
				}
			}
		},
		[elements, onSelect, selectedElements]
	);

	const checkForHeader = (
		header: string,
		index: number,
		elements: SelectElement[]
	) => {
		if (!header) {
			return false;
		}

		if (header && index === 0) {
			return true;
		}

		if (header && index > 0) {
			if (elements[index - 1]?.header === header) {
				return false;
			}
		}
		return true;
	};

	const filteredElements = useMemo(() => {
		const ele: SelectElement[] = [];

		const sortHandler = (a: SelectElement, b: SelectElement) => {
			const aSelected = selectedElements.find(
				(el) => el.value === a.value
			);
			const bSelected = selectedElements.find(
				(el) => el.value === b.value
			);
			if (aSelected && !bSelected) {
				return -1;
			}
			if (!aSelected && bSelected) {
				return 1;
			}
			return a?.label?.localeCompare(b.label);
		};

		if (!searchInput) {
			return elements.sort(sortHandler);
		}

		elements.forEach((element: SelectElement) => {
			if (
				Object.values(element)
					.join("")
					.toLowerCase()
					.includes(searchInput.toLowerCase())
			) {
				ele.push(element);
			}
		});

		return ele.sort(sortHandler);
	}, [searchInput]);

	return (
		<div className={"elements_container"}>
			{title && (
				<>
					<h3>{title}</h3>
					<Divider showLine={false} />
				</>
			)}
			{isSearchable && (
				<div className={"filter_container"}>
					<input
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Suche ..."
					/>
				</div>
			)}
			{selectAll && (
				<>
					<div className={"filter_container"}>
						<ListElement
							key={"select_all"}
							element={{
								value: "select_all",
								label: "Alle auswählen"
							}}
							isSelected={
								selectedElements.length === elements.length
							}
							onSelect={() => {
								if (selectedElements.length === elements.length)
									onSelect([]);
								else {
									const newElements = elements.filter(
										(el: SelectElement) => !el.single
									);
									onSelect(newElements);
								}
							}}
							// useTiles={useTiles}
						/>
					</div>
					<Divider showLine size="small" />
				</>
			)}
			<div className={"elements_interface_container"} data-row={useTiles}>
				{filteredElements.map(
					(element: SelectElement, index, elements) => (
						<Fragment key={element.value}>
							{checkForHeader(
								element.header,
								index,
								elements
							) && <label>{element.header}</label>}
							<ListElement
								key={element.value}
								element={element}
								isSelected={
									!selectProperty
										? selectedElements.some(
												(el: SelectElement) =>
													el?.value === element.value
											) || false
										: element.selected || false
								}
								onSelect={elementChangeHandler}
								useTiles={useTiles}
							/>
						</Fragment>
					)
				)}
			</div>
		</div>
	);
};

export default ElementSelectInterface;
