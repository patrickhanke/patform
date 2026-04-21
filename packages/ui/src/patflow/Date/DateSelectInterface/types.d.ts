type CommonProps = {
	isService?: boolean;
	tasksRefetch?: () => void;
};

type InlineProps = CommonProps & {
	isInline: true;
	externalDate: DateObjectWithNextDates;
	setExternalDate: (date: DateObjectWithNextDates) => void;
	task?: Task;
	showDateInterface?: boolean;
	setShowDateInterface?: React.Dispatch<React.SetStateAction<boolean>>;
};

type NonInlineProps = CommonProps & {
	isInline?: false;
	task: Task;
	showDateInterface: boolean;
	setShowDateInterface: React.Dispatch<React.SetStateAction<boolean>>;
	setExternalDate?: (date: DateObjectWithNextDates) => void;
};

export type DateSelectInterfaceProps = InlineProps | NonInlineProps;
