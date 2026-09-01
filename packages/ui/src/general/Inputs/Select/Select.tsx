"use client";

import { useMemo, useState } from "react";
import {
	Combobox,
	createListCollection,
	Field,
	Portal,
	Span,
	useFilter
} from "@chakra-ui/react";
import { isArray } from "lodash-es";
import { ErrorDisplay } from "../../Displays";
import { SelectOption, SelectOptionGroup, SelectType } from "./types";

type CollectionItem = {
	label: string;
	value: string;
	disabled?: boolean;
	original: SelectOption;
	group?: string;
};

const isOptionGroup = (
	option: SelectOption | SelectOptionGroup
): option is SelectOptionGroup =>
	typeof option === "object" &&
	option !== null &&
	isArray((option as SelectOptionGroup).options) &&
	!("value" in option);

const getOptionKey = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};

const flattenOptions = (
	options: SelectType["options"]
): { items: CollectionItem[]; hasGroups: boolean } => {
	const items: CollectionItem[] = [];
	let hasGroups = false;

	options?.forEach((option) => {
		if (!option) return;

		if (isOptionGroup(option)) {
			hasGroups = true;
			option.options.forEach((child) => {
				items.push({
					label: child.label,
					value: getOptionKey(child.value),
					disabled: !!child.isDisabled,
					original: child,
					group: option.label
				});
			});
			return;
		}

		items.push({
			label: option.label,
			value: getOptionKey(option.value),
			disabled: !!option.isDisabled,
			original: option
		});
	});

	return { items, hasGroups };
};

const resolveValueKey = (
	value: unknown,
	items: CollectionItem[]
): string | null => {
	if (value == null || value === "") return null;

	if (typeof value === "object" && "value" in (value as object)) {
		const key = getOptionKey((value as SelectOption).value);
		return key || null;
	}

	const directMatch = items.find((item) => item.original.value === value);
	if (directMatch) return directMatch.value;

	const key = getOptionKey(value);
	return items.some((item) => item.value === key) ? key : null;
};

const Select = ({
	onChange,
	value,
	placeholder,
	options,
	isMulti = false,
	isDisabled = false,
	isClearable = false,
	menuPosition = "fixed",
	label,
	id,
	errors,
	width = 150
}: SelectType) => {
	const { items, hasGroups } = useMemo(
		() => flattenOptions(options),
		[options]
	);
	const { contains } = useFilter({ sensitivity: "base" });
	const [filterText, setFilterText] = useState("");

	const filteredItems = useMemo(() => {
		if (!filterText) return items;
		return items.filter((item) => contains(item.label, filterText));
	}, [contains, filterText, items]);

	const collection = useMemo(
		() =>
			createListCollection({
				items: filteredItems,
				itemToString: (item) => item.label,
				itemToValue: (item) => item.value,
				isItemDisabled: (item) => !!item.disabled
			}),
		[filteredItems]
	);

	const groupedItems = useMemo(() => {
		if (!hasGroups) return [];

		const groups = new Map<string, CollectionItem[]>();
		collection.items.forEach((item) => {
			const groupLabel = item.group || "";
			const groupItems = groups.get(groupLabel) || [];
			groupItems.push(item);
			groups.set(groupLabel, groupItems);
		});

		return Array.from(groups.entries());
	}, [hasGroups, collection]);

	const selectedValues = useMemo(() => {
		if (value == null || value === "") return [];
		if (isArray(value)) {
			return value
				.map((entry) => resolveValueKey(entry, items))
				.filter((key): key is string => !!key);
		}
		const key = resolveValueKey(value, items);
		return key ? [key] : [];
	}, [value, items]);

	const selectedItems = useMemo(
		() =>
			selectedValues
				.map((key) => items.find((item) => item.value === key))
				.filter((item): item is CollectionItem => !!item),
		[items, selectedValues]
	);
	const selectedLabel = isMulti ? "" : (selectedItems[0]?.label ?? "");
	const inputValue = isMulti ? filterText : filterText || selectedLabel;

	const hasErrors = !!errors?.some((error) => (id ? error.id === id : true));
	const cssWidth = typeof width === "number" ? `${width}px` : width;

	const renderItem = (item: CollectionItem) => (
		<Combobox.Item
			item={item}
			key={item.value}
			fontSize="12px"
			fontWeight="500"
			px="12px"
			py="6px"
		>
			<Combobox.ItemText>{item.label}</Combobox.ItemText>
			<Combobox.ItemIndicator />
		</Combobox.Item>
	);

	const menuItems = hasGroups
		? groupedItems.map(([groupLabel, groupItems]) => (
				<Combobox.ItemGroup key={groupLabel}>
					<Combobox.ItemGroupLabel>
						{groupLabel}
					</Combobox.ItemGroupLabel>
					{groupItems.map(renderItem)}
				</Combobox.ItemGroup>
			))
		: collection.items.map(renderItem);

	return (
		<Field.Root
			invalid={hasErrors}
			disabled={isDisabled}
			width={cssWidth}
			position="relative"
		>
			<Combobox.Root
				collection={collection}
				value={selectedValues}
				inputValue={inputValue}
				selectionBehavior={isMulti ? "clear" : "replace"}
				onValueChange={(details) => {
					const selected = details.value
						.map(
							(key) =>
								items.find((item) => item.value === key)
									?.original
						)
						.filter((option): option is SelectOption => !!option);

					if (isMulti) {
						onChange(selected);
						return;
					}

					onChange(selected[0] ?? null);
				}}
				onInputValueChange={(details) => {
					if (!isMulti && details.inputValue === selectedLabel) {
						setFilterText("");
						return;
					}
					setFilterText(details.inputValue);
				}}
				onOpenChange={() => {
					setFilterText("");
				}}
				multiple={isMulti}
				closeOnSelect={!isMulti}
				disabled={isDisabled}
				invalid={hasErrors}
				id={id}
				size="xs"
				width="full"
				openOnClick
				positioning={{
					strategy: menuPosition,
					hideWhenDetached: true,
					placement: "bottom-start"
				}}
			>
				{label && (
					<Combobox.Label fontSize="12px" fontWeight="500">
						{label}
					</Combobox.Label>
				)}
				<Combobox.Control minH="26px" h="auto" flexWrap="wrap">
					{isMulti &&
						selectedItems.map((item) => (
							<Span
								key={item.value}
								fontSize="12px"
								fontWeight="500"
								lineHeight="1.2"
								px="6px"
								py="2px"
								ml="4px"
								bg="bg.muted"
								rounded="sm"
							>
								{item.label}
							</Span>
						))}
					<Combobox.Input
						placeholder={
							isMulti && selectedItems.length > 0
								? ""
								: placeholder
						}
						h="auto"
						minH="26px"
						px="12px"
						py="4.5px"
						fontSize="12px"
						fontWeight="500"
						letterSpacing="0.6px"
						flex="1"
						minW="40px"
						onFocus={(event) => event.currentTarget.select()}
					/>
					<Combobox.IndicatorGroup p="4px">
						{isClearable && <Combobox.ClearTrigger />}
						<Combobox.Trigger scale="0.8" />
					</Combobox.IndicatorGroup>
				</Combobox.Control>
				<Portal>
					<Combobox.Positioner
						onMouseDown={(event) => event.stopPropagation()}
						onPointerDown={(event) => event.stopPropagation()}
						onTouchStart={(event) => event.stopPropagation()}
					>
						<Combobox.Content fontSize="12px" fontWeight="500">
							<Combobox.Empty>Keine Ergebnisse</Combobox.Empty>
							{menuItems}
						</Combobox.Content>
					</Combobox.Positioner>
				</Portal>
			</Combobox.Root>
			<ErrorDisplay errors={errors} id={id} />
		</Field.Root>
	);
};

export default Select;
