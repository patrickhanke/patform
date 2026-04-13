import { useMemo } from "react";
import { Property, StaffMember } from "@repo/types";
import { useDataStore } from "@repo/provider";
import { SiteHeaderContentComponent } from "../types";
import { filterChangeHandler } from "@repo/provider";
import { Select, TextInput } from "@repo/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";

const SiteHeaderContent = ({
	id,
	filters,
	setFilters,
	initialFilters
}: SiteHeaderContentComponent) => {
	const { properties, workers } = useDataStore();

	console.log({ properties });
	console.log({ workers });

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const selectOptions = useMemo(() => {
		let objectOptions = [] as { value: string; label: string }[];
		let staffOptions = [] as { value: string; label: string }[];

		if (properties) {
			objectOptions = properties.map((property: Property) => ({
				value: property.objectId,
				label: property.name
			}));
		}
		if (workers) {
			staffOptions = workers.map((staff: StaffMember) => ({
				value: staff.objectId,
				label: `${staff.first_name} ${staff.last_name}`
			}));
		}

		return { objectOptions, staffOptions };
	}, [properties, workers, filters]);

	return (
		<div className="flex row j-sb a-ce">
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
					placeholder="Task ID..."
					width="90px"
				/>
				{!id && (
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
						onChange={(value) =>
							setFilters(
								filterChangeHandler(
									"property",
									value.value,
									"equalTo",
									filters
								)
							)
						}
						placeholder="Objekt..."
						isClearable
					/>
				)}
				{workers && (
					<Select
						label=""
						width="150px"
						options={selectOptions.staffOptions}
						value={
							filters.find(
								(filterElement) =>
									filterElement.key === "assigned_staff"
							)?.value || null
						}
						onChange={(value) =>
							setFilters(
								filterChangeHandler(
									"assigned_staff",
									value.value,
									"in",
									filters
								)
							)
						}
						placeholder="Mitarbeiter..."
						isClearable
					/>
				)}
				<button
					className="full_button md secondary"
					onClick={() => {
						if (searchParams.get("task")) {
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
		</div>
	);
};

export default SiteHeaderContent;
