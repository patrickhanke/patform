import { getImageUrl } from "@repo/provider";
import { UserDisplayProps } from "./types";
import { Avatar } from "@chakra-ui/react";

const UserDisplay = ({ user, onlyImage = false }: UserDisplayProps) => {
	if (!user) {
		return null;
	}

	return (
		<div className={"flex row a-ce gap-xs"} data-onlyimage={onlyImage}>
			<div
				className={"display_user_image_container"}
				data-onlyimage={onlyImage}
			>
				<Avatar.Root
					// colorPalette={worker.color}
					size={"2xs"}
					// css={ringCss}
				>
					<Avatar.Fallback name={`${user.label}`} />
					<Avatar.Image
						src={getImageUrl({
							fileName: user?.portrait?.name || "",
							width: onlyImage ? 24 * 4 : 18 * 4,
							height: onlyImage ? 24 * 4 : 18 * 4
						})}
					/>
				</Avatar.Root>
			</div>

			<div>{`${user.label}`}</div>
		</div>
	);
};

export default UserDisplay;
