import { FC } from "react";
import { ListElementProps } from "../types";
import clsx from "clsx";
import { Icon } from "@repo/ui";
import "../styles.scss";

const ListElement: FC<ListElementProps> = ({
	element,
	isSelected,
	onSelect,
	useTiles = false
}) => {
	return (
		<>
			<button
				className={clsx("content_element", "list_element_container")}
				data-tile={useTiles}
				data-selected={isSelected}
				onClick={() => onSelect(element)}
				disabled={element.disabled || false}
			>
				<div>
					<Icon
						type={isSelected ? "circle-check" : "circle"}
						strokeWidth={1.8}
						color={isSelected ? "green" : "gray"}
					/>
				</div>
				{element.element ? element.element : <p>{element.label}</p>}
			</button>
		</>
	);
};

export default ListElement;
