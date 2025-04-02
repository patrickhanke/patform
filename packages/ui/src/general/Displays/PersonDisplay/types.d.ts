import { PersonClass } from "@types";

export type PersonDisplayProps = {
	person: { portrait?: string; label: string } | PersonClass;
	onlyImage?: boolean;
};
