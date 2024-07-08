import { create } from 'zustand';
import { SlideInStoreProps } from '../types';

const useSlideInStore = create<SlideInStoreProps>((set, get) => ({
	content: null,
	secondaryContent: null,
	isOpen: false,
	setContent: (content: React.FC) => set({ content, isOpen: true }),
	setSecondaryContent: (secondaryContent: React.FC) => {
		if (!get().content) {
			return null;
		}
		set({ secondaryContent});
	},
    
	closeSlideIn: () => set({ isOpen: false, content: null, secondaryContent: null })
    
}));

export default useSlideInStore;