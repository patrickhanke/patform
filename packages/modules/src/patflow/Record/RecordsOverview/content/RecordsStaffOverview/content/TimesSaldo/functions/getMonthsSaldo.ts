import { MonthData } from "../types";

const getMonthsSaldo = (
	startId: number,
	endId: number,
	monthData: MonthData[]
) => {
	let saldo = 0;
	for (let i = startId; i <= endId; i++) {
		if (!monthData[i]) {
			continue;
		}
		const monthSaldo = monthData[i]?.monthSaldoInt || 0;
		saldo += monthSaldo;
	}

	return saldo;
};

export default getMonthsSaldo;
