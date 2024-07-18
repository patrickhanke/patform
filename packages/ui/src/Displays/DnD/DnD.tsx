'use client';

import {useState, useEffect, useCallback} from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Sortable from './components/Sortable';
import { DnD_Type, DnDItem, DnDItems } from './types';
import SortableOverlay from './components/SortableOverlay';
import { useDataHandler } from '@repo/provider';

const item = {
	value: '',
	label: '',
	id: ''
};

const DnD = ({items, ItemComponent, componentStyles, objectClass}: DnD_Type) => {
	const [listItems, setListItems] = useState(items as DnDItems);
	const [activeItem, setActiveItem] = useState(item as DnDItem);
	const {updateData} = useDataHandler();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);
		
	useEffect(() => {
		if (items.length > 0) {
			setListItems(items);
		}
	}, []);

	const afterSortFunction = useCallback(async (items: DnDItem[]) =>{ 
		const newQuestions = items.map((item, index) =>  updateData({
			className: objectClass,
			objectId: item.id,
			updateObject: {
				position: index + 1
			}
		}));
		await Promise.all(newQuestions);
	}, []);


	const onChange = useCallback((itemArray: DnDItems) => {
		setListItems(itemArray);
		afterSortFunction(itemArray);
	}, []);

	return (
		<DndContext 
			collisionDetection={closestCenter}
			sensors={sensors}
			onDragStart={({ active }) => {
				setActiveItem(active as unknown as DnDItem);
			}}
			onDragEnd={({ active, over }) => {
				if (active.id !== over?.id) {
					const activeIndex = listItems.findIndex(({ id }) => id === active.id);
					const overIndex = listItems.findIndex(({ id }) => id === over?.id);

					onChange(arrayMove(listItems, activeIndex, overIndex));
					// afterSortFunction(arrayMove(listItems, activeIndex, overIndex))
				}
				// setActiveItem(item);
			}}
			onDragCancel={() => {
				setActiveItem(item);
			}}
		> 
			<SortableContext items={listItems.map(item => item.id)} strategy={verticalListSortingStrategy} >
				{listItems.map(item => (
					<Sortable
						key={item.id}
						id={item.id}
						item={item}
						ItemComponent={ItemComponent}
						componentStyles={componentStyles}
					/>
				))}
			</SortableContext>
			<SortableOverlay>
				{activeItem?.id ? (
					<ItemComponent item={activeItem} id={activeItem.id} />
				): null}
			</SortableOverlay>

		</DndContext>
	);
};

export default DnD;