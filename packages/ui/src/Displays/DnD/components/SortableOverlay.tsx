import type { PropsWithChildren } from 'react';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { DropAnimation } from '@dnd-kit/core';

const dropAnimationConfig: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.4'
			}
		}
	})
};

function SortableOverlay({ children }: PropsWithChildren<unknown>) {
	return (
		<DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
	);
}

export default SortableOverlay;