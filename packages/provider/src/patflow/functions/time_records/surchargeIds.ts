type IdRef = {
	objectId: string;
	former_id?: string;
};

export const surchargeIncludesHoliday = (
	dayValue: string[] | undefined,
	holiday: IdRef
) => {
	if (!dayValue?.length) {
		return false;
	}
	return (
		dayValue.includes(holiday.objectId) ||
		(!!holiday.former_id && dayValue.includes(holiday.former_id))
	);
};

export const remapSurchargeDayValue = (
	dayValue: string[] | undefined,
	holidays: IdRef[]
) => {
	if (!dayValue?.length) {
		return [];
	}
	return dayValue.map((id) => {
		const holiday = holidays.find(
			(item) => item.objectId === id || item.former_id === id
		);
		return holiday?.objectId || id;
	});
};

export const findSurchargeById = <T extends IdRef>(
	surcharges: T[],
	surchargeId: string
) =>
	surcharges.find(
		(surcharge) =>
			surcharge.objectId === surchargeId ||
			surcharge.former_id === surchargeId
	);
