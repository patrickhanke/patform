import { useEffect, useMemo } from "react";
import { StaffMember } from "@repo/types";
import { FIND_ALL_STAFF } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { SiteHeaderContentProps } from "../types";
import { months } from "@repo/provider";
import { Loader } from "lucide-react";
import { Select } from "@repo/ui";

const SiteHeaderContent = ({
	selectedMonth,
	setSelectedMonth,
	selectedUser,
	setSelectedUser
}: SiteHeaderContentProps) => {
	const { data: staffData } = useQuery(FIND_ALL_STAFF);

	const selectOptions = useMemo(() => {
		let staffOptions = [] as { value: string; label: string }[];
		const monthOptions = [
			{ value: "all", label: "Alle Monate" },
			...months
		];
		if (staffData) {
			staffOptions = staffData.objects.find_User.results.map(
				(staff: StaffMember) => ({
					value: staff.objectId,
					label: `${staff.first_name} ${staff.family_name}`,
					...staff
				})
			);
		}

		return { staffOptions, monthOptions };
	}, [staffData]);

	useEffect(() => {
		if (selectOptions.staffOptions && !selectedUser) {
			setSelectedUser(selectOptions.staffOptions[0]);
		}
	}, [selectedMonth, setSelectedMonth]);

	return (
		<div className="flex row j-sb a-ce">
			<div className="button_container">
				{staffData ? (
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
