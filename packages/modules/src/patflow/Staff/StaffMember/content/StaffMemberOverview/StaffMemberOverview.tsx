import { useGetData } from "@repo/provider";
import React, { useMemo } from "react";
import DisplayUserData from "./components/DisplayUserData";
import styles from "./StaffMemberOverview.module.scss";
import clsx from "clsx";

const StaffMemberOverview = ({ userId }: { userId: string }) => {
	const { data } = useGetData({
		objectName: "User",
		fields: ["objectId", "first_name", "last_name", "email", "role {name}"],
		id: userId
	});

	const createUserDisplayData = useMemo(() => {
		if (data) {
			return {
				Vorname: data.first_name || ("" as string),
				Nachname: data.last_name || ("" as string),
				Rolle: data.role?.name || ("" as string),
				"E-Mail": data.email || ("" as string)
			} as const;
		}
		return null;
	}, [data]);

	return (
		<div className="site_content">
			<div className={styles.overview_container}>
				<div className={clsx(styles.user_data_container)}>
					<h3>Allgemeine Daten</h3>
					{createUserDisplayData &&
						Object.keys(createUserDisplayData).map((key) => {
							const typedKey =
								key as keyof typeof createUserDisplayData;
							return (
								<DisplayUserData
									key={key}
									label={key}
									value={createUserDisplayData[typedKey]}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
};

export default StaffMemberOverview;
