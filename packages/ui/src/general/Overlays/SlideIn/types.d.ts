export type SlideInProps = {
	children: React.ReactNode;
	header: string;
	isOpen: boolean;
	cancel: () => void;
	confirm: () => void;
	size?: "small" | "medium" | "large";
	preventClickOutside?: boolean;
	secondaryContent?: React.ReactNode | null;
	showSecondaryContent?: boolean;
	showCancelButton?: boolean;
	disabled?: [boolean, boolean];
	errors?: ErrorMessage[];
	confirmText?: string;
	loading?: boolean;
};

export type SlideInStoreProps = {
	isOpen: boolean;
	content?: React.FC | null;
	secondaryContent?: React.FC | null;
	closeSlideIn: () => void;
	setContent: (content: React.FC) => void;
	setSecondaryContent: (content: React.FC) => void;
};
