import React, { useCallback } from "react";
import { axiosclient, generateGraphQLQuery_4_1 } from "@repo/provider";
import { useQuery } from "@apollo/client";
import { Button } from "@repo/ui";

const Cms = () => {
	const changeClassOfData = useCallback(() => {
		axiosclient()
			.post("functions/change-object-class", {
				oldClassName: "News",
				newClassName: "Entry"
			})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<Button text="Change Class of Data" onClick={changeClassOfData} />
		</div>
	);
};

export default Cms;
