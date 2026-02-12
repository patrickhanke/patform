import { create } from "zustand";
import { Holiday, PatflowUser, Property, Record } from "@repo/types";

export type DataStoreState = {
	holidays: Holiday[];
	workers: PatflowUser[];
	records: Record[];
	properties: Property[];
	setHolidays: (holidays: Holiday[]) => void;
	setWorkers: (workers: PatflowUser[]) => void;
	setRecords: (records: Record[]) => void;
	setProperties: (properties: Property[]) => void;
};

const useDataStore = create<DataStoreState>((set) => ({
	holidays: [],
	workers: [],
	records: [],
	properties: [],
	setHolidays: (holidays: Holiday[]) => set({ holidays }),
	setWorkers: (workers: PatflowUser[]) => set({ workers }),
	setRecords: (records: Record[]) => set({ records }),
	setProperties: (properties: Property[]) => set({ properties })
}));

export default useDataStore;
