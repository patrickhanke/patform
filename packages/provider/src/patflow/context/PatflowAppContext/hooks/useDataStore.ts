import { create } from "zustand";
import { DataStoreState } from "../types";

const useDataStore = create<DataStoreState>((set) => ({
	holidays: [],
	workers: [],
	surcharges: [],
	records: [],
	properties: [],
	setSurcharges: (surcharges) => set({ surcharges }),
	setHolidays: (holidays) => set({ holidays }),
	setWorkers: (workers) => set({ workers }),
	setRecords: (records) => set({ records }),
	setProperties: (properties) => set({ properties })
}));

export default useDataStore;
