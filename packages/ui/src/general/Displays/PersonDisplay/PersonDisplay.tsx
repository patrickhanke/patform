import { getImageUrl } from "@repo/provider";
import "./styles.scss";
import { PersonDisplayProps } from "./types";
import Image from "next/image";

const PersonDisplay = ({ person, onlyImage = false }: PersonDisplayProps) => {
	if (!person) {
		return null;
	}

	return (
		<div className={"display_person_container"} data-onlyimage={onlyImage}>
			{person.portrait ? (
				<div
					className={"display_person_image_container"}
					data-onlyimage={onlyImage}
				>
					<Image
						alt={person.label}
						src={getImageUrl({
							fileName: person?.portrait?.name,
							height: onlyImage ? 24 : 18,
							width: onlyImage ? 24 : 18
						})}
						height={onlyImage ? 24 : 18}
						width={onlyImage ? 24 : 18}
					/>
				</div>
			) : (
				<div
					className={"display_person_no_image"}
					data-onlyimage={onlyImage}
				>
					<div className={"display_person_no_image_placeholder"} />
					<div className="display_person_no_image_character">
						{person.label &&
							person.label
								.split(" ")
								.map((word: string) => word[0])
								.join("")}
					</div>
				</div>
			)}
			<div className="display_person_label" data-onlyimage={onlyImage}>
				{`${person.label}`}
			</div>
		</div>
	);
};

export default PersonDisplay;
