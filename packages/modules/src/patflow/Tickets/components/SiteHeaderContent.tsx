import { FC, useMemo } from "react";
import { Select } from "@repo/ui";
import { useFindData } from "@repo/provider";
import { SiteHeaderContentComponent } from "../types";
import styles from "../Tickets.module.scss";
import { filterChangeHandler, getDateString } from "@repo/provider";
import { Property, Ticket } from "@repo/types";
import { TextInput } from "@repo/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";

const SiteHeaderContent: FC<SiteHeaderContentComponent> = ({
	id,
	filters,
	setFilters,
	initialFilters,
	tickets
}) => {
	const { data: objectData } = useFindData({
		objectName: "Property",
		fields: ["objectId", "name"],
		skipQuery: !!id
	});

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const selectOptions = useMemo(() => {
		const dateOptions = [] as { value: string; label: string }[];
		let objectOptions = [] as { value: string; label: string }[];

		if (objectData) {
			objectOptions = objectData.map(
				(property: Property) => ({
					value: property.objectId,
					label: property.name
				})
			);
		}

		if (tickets && dateOptions.length === 0) {
			tickets.forEach((ticket: Ticket) => {
				if (
					!dateOptions.find(
						(option) =>
							option.label ===
							getDateString(ticket.createdAt).date
					)
				)
					dateOptions.push({
						value: ticket.createdAt,
						label: getDateString(ticket.createdAt).date
					});
			});
		}
		return { dateOptions, objectOptions };
	}, [tickets]);

	return (
		<div className={styles.siteheader_content}>
			<div className="button_container">
				<TextInput
					label=""
					id="objectId"
					defaultValue={
						(filters.find(
							(filterElement) => filterElement.key === "objectId"
						)?.value as string) || ""
					}
					onChange={(value) =>
						setFilters(
							filterChangeHandler(
								"objectId",
								value,
								"equalTo",
								filters
							)
						)
					}
					placeholder="Ticket ID..."
					width="90px"
				/>
				{!id && objectData && (
					<Select
						label=""
						width="150px"
						options={selectOptions.objectOptions}
						value={
							filters.find(
								(filterElement) =>
									filterElement.key === "property"
							)?.value || null
						}
						onChange={(value) => {
							setFilters(
								filterChangeHandler(
									"property",
									value?.value,
									"equalTo",
									filters
								)
							);
						}}
						placeholder="Objekt..."
						isClearable
					/>
				)}
				<Select
					label=""
					options={selectOptions.dateOptions}
					value={
						filters.find(
							(filterElement) => filterElement.key === "createdAt"
						)?.value || null
					}
					onChange={(value) =>
						setFilters(
							filterChangeHandler(
								"createdAt",
								value?.value,
								"_gte",
								filters
							)
						)
					}
					placeholder="Von..."
					isClearable
				/>
				<Select
					label=""
					options={selectOptions.dateOptions}
					value={
						filters.find(
							(filterElement) => filterElement.key === "createdAt"
						)?.value || null
					}
					onChange={(value) =>
						setFilters(
							filterChangeHandler(
								"createdAt",
								value?.value,
								"_lte",
								filters
							)
						)
					}
					placeholder="Bis..."
					isClearable
				/>
			</div>
			<button
				className="full_button md secondary"
				onClick={() => {
					if (searchParams.get("ticket")) {
						router.push(pathname);
					}
					setFilters(initialFilters());
				}}
			>
				<RefreshCcw
					size={12}
					style={{ transform: "translateY(2px)" }}
				/>
			</button>
		</div>
	);
};

export default SiteHeaderContent;
