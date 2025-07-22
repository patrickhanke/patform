import { useEffect, useMemo } from "react";
import { StaffMember } from "@repo/types";
import { SiteHeaderContentProps } from "../types";
import { months } from "@repo/provider";
import { Loader } from "lucide-react";
import { Select } from "@repo/ui";

const SiteHeaderContent = ({
	selectedMonth,
	setSelectedMonth,
	selectedUser,
	setSelectedUser,
	staff
}: SiteHeaderContentProps) => {
	const selectOptions = useMemo(() => {
		let staffOptions = [] as { value: string; label: string }[];
		const monthOptions = [
			{ value: "all", label: "Alle Monate" },
			...months
		];
		console.log({ staff });

		staffOptions = staff.map((staff: StaffMember) => ({
			value: staff.objectId,
			label: `${staff.first_name} ${staff.family_name}`,
			...staff
		}));

		return { staffOptions, monthOptions };
	}, [staff]);

	useEffect(() => {
		if (selectOptions.staffOptions && !selectedUser) {
			setSelectedUser(selectOptions.staffOptions[0]);
		}
	}, [selectedMonth, setSelectedMonth, staff]);

	return (
		<div className="flex row j-sb a-ce">
			<div className="button_container">
				{staff ? (
					<Select
						label=""
						width="240px"
						options={selectOptions.staffOptions}
						value={selectedUser}
						onChange={(value) => setSelectedUser(value)}
						placeholder="Mitarbeiter..."
						isClearable
					/>
				) : (
					<Loader height="30px" width="150px" />
				)}
				<Select
					label=""
					width="90px"
					options={selectOptions.monthOptions}
					value={selectedMonth}
					onChange={(value) => setSelectedMonth(value)}
					placeholder="Moat wälen"
					isDisabled={!selectedUser}
				/>
			</div>
		</div>
	);
};

export default SiteHeaderContent;
