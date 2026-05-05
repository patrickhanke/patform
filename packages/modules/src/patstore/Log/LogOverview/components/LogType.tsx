import type { LogType } from "@repo/types";
import { StateDisplay } from "@repo/ui";

const LogType = ({ type }: { type: LogType }) => {
	const getColor = (type: LogType) => {
		switch (type) {
			case "info":
				return "green";
			case "warn":
				return "yellow";
			case "error":
				return "red";
			default:
				return "gray";
		}
	};
	return <StateDisplay label={type} color={getColor(type)} />;
};

export default LogType;
