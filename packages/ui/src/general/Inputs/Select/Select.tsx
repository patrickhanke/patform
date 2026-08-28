"use client";

import { useMemo } from "react";
import {
	createListCollection,
	Field,
	Portal,
	Select as ChakraSelect
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

	const collection = useMemo(
		() =>
			createListCollection({
				items,
				itemToString: (item) => item.label,
				itemToValue: (item) => item.value,
				isItemDisabled: (item) => !!item.disabled
			}),
		[items]
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

	const hasErrors = !!errors?.some((error) => (id ? error.id === id : true));
	const cssWidth = typeof width === "number" ? `${width}px` : width;

	const renderItem = (item: CollectionItem) => (
		<ChakraSelect.Item
			item={item}
			key={item.value}
			fontSize="12px"
			fontWeight="500"
			px="12px"
			py="6px"
		>
			<ChakraSelect.ItemText>{item.label}</ChakraSelect.ItemText>
			<ChakraSelect.ItemIndicator />
		</ChakraSelect.Item>
	);

	const menuItems = hasGroups
		? groupedItems.map(([groupLabel, groupItems]) => (
				<ChakraSelect.ItemGroup key={groupLabel}>
					<ChakraSelect.ItemGroupLabel>
						{groupLabel}
					</ChakraSelect.ItemGroupLabel>
					{groupItems.map(renderItem)}
				</ChakraSelect.ItemGroup>
			))
		: collection.items.map(renderItem);

	return (
		<Field.Root
			invalid={hasErrors}
			disabled={isDisabled}
			width={cssWidth}
			position="relative"
		>
			<ChakraSelect.Root
				collection={collection}
				value={selectedValues}
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
				multiple={isMulti}
				closeOnSelect={!isMulti}
				disabled={isDisabled}
				invalid={hasErrors}
				id={id}
				size="xs"
				width="full"
				positioning={{
					strategy: menuPosition,
					hideWhenDetached: true,
					placement: "bottom-start"
				}}
			>
				<ChakraSelect.HiddenSelect />
				{label && (
					<ChakraSelect.Label fontSize="12px" fontWeight="500">
						{label}
					</ChakraSelect.Label>
				)}
				<ChakraSelect.Control>
					<ChakraSelect.Trigger
						h="auto"
						minH="26px"
						px="12px"
						py="4.5px"
						fontSize="12px"
						fontWeight="500"
						letterSpacing="0.6px"
					>
						<ChakraSelect.ValueText placeholder={placeholder} />
					</ChakraSelect.Trigger>
					<ChakraSelect.IndicatorGroup p="4px">
						{isClearable && <ChakraSelect.ClearTrigger />}
						<ChakraSelect.Indicator scale="0.8" />
					</ChakraSelect.IndicatorGroup>
				</ChakraSelect.Control>
				<Portal>
					<ChakraSelect.Positioner
						onMouseDown={(event) => event.stopPropagation()}
						onPointerDown={(event) => event.stopPropagation()}
						onTouchStart={(event) => event.stopPropagation()}
					>
						<ChakraSelect.Content fontSize="12px" fontWeight="500">
							{menuItems}
						</ChakraSelect.Content>
					</ChakraSelect.Positioner>
				</Portal>
			</ChakraSelect.Root>
			<ErrorDisplay errors={errors} id={id} />
		</Field.Root>
	);
};

export default Select;
