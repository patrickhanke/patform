import { PersonClass } from "@types";

export type PersonDisplayProps = {
	person: { image?: string; label: string } | PersonClass;
	onlyImage?: boolean;
};
