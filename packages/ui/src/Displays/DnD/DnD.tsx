"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Sortable from "./components/Sortable";
import { DnDProps } from "./types";
import SortableOverlay from "./components/SortableOverlay";
import { useDataHandler } from "@repo/provider";

const item = {
  value: "",
  label: "",
  id: "",
};

const DnD = <T extends any[]>({
  items,
  ItemComponent,
  componentStyles,
  objectClass,
  subField,
  onChange,
  refetch,
}: DnDProps<T>) => {
  const [listItems, setListItems] = useState([] as unknown as typeof items);
  const [activeItem, setActiveItem] = useState(item as (typeof items)[number]);
  const { updateData } = useDataHandler();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (items.length > 0 && items.length !== listItems.length) {
      setListItems(items);
    }
  }, [items]);

  const afterSortFunction = useCallback(async (newItems: typeof items) => {
    if (objectClass && subField?.id && subField?.field) {
      await updateData({
        className: objectClass,
        objectId: subField.id,
        updateObject: {
          [subField.field]: newItems.map((item, index) => ({
            ...item,
            position: index + 1,
          })),
        },
      });
      if (refetch) {
        refetch();
      }
    } else if (objectClass) {
      const newItemsPromise = newItems.map((item, index) =>
        updateData({
          className: objectClass,
          objectId: item.id,
          updateObject: {
            position: index + 1,
          },
        })
      );
      await Promise.all(newItemsPromise);
      if (refetch) {
        refetch();
      }
    } else if (onChange) {
      onChange(newItems);
    }
  }, []);

  const afterDrop = useCallback((itemArray: typeof items) => {
    setListItems(itemArray);
    afterSortFunction(itemArray);
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={({ active }) => {
        setActiveItem(active as unknown as (typeof items)[number]);
      }}
      onDragEnd={({ active, over }) => {
        if (active.id !== over?.id) {
          const activeIndex = listItems.findIndex(({ id }) => id === active.id);
          const overIndex = listItems.findIndex(({ id }) => id === over?.id);

          afterDrop(
            arrayMove(listItems, activeIndex, overIndex) as typeof items
          );
          // afterSortFunction(arrayMove(listItems, activeIndex, overIndex))
        }
        // setActiveItem(item);
      }}
      onDragCancel={() => {
        setActiveItem(item);
      }}
    >
      <SortableContext
        items={listItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {listItems.map((item) => (
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
        ) : null}
      </SortableOverlay>
    </DndContext>
  );
};

export default DnD;
