import { useMemo, createContext, useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../styles.scss";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { Sortable_Type } from "../types";
import clsx from "clsx";

interface Context {
	attributes: Record<string, any>;
	listeners: DraggableSyntheticListeners;
	ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
	attributes: {},
	listeners: undefined,
	ref() {
		null;
	}
});

const Sortable = ({
	id,
	item,
	ItemComponent,
	componentStyles = () => ({})
}: Sortable_Type) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		setActivatorNodeRef,
		isDragging
	} = useSortable({ id });

	const context = useMemo(
		() => ({
			attributes,
			listeners,
			ref: setActivatorNodeRef
		}),
		[attributes, listeners, setActivatorNodeRef]
	);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		...componentStyles(item)
	};

	return (
		<SortableItemContext.Provider value={context}>
			<div
				ref={setNodeRef}
				style={style}
				className={clsx("drag_container", "content_element")}
				data-is_dragging={isDragging}
			>
				<DragHandle />
				<div className={"drag_content"}>
					<ItemComponent item={item} id={id} key={id} />
				</div>
			</div>
		</SortableItemContext.Provider>
	);
};

export function DragHandle() {
	const { attributes, listeners, ref } = useContext(SortableItemContext);

	return (
		<button
			className={"drag_handle"}
			{...attributes}
			{...listeners}
			ref={ref}
		>
			<svg viewBox="0 0 20 20" width="12" color="#fefefe">
				<path
					fill="grey"
					d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
				></path>
			</svg>
		</button>
	);
}

export default Sortable;
