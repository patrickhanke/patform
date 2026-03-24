import { create } from "zustand";
import { Holiday, Property, Record, Surcharge, Worker } from "@repo/types";

export type DataStoreState = {
	holidays: Holiday[];
	workers: Worker[];
	records: Record[];
	properties: Property[];
	surcharges: Surcharge[];
	setHolidays: (holidays: Holiday[]) => void;
	setWorkers: (workers: Worker[]) => void;
	setRecords: (records: Record[]) => void;
	setProperties: (properties: Property[]) => void;
	setSurcharges: (surcharges: Surcharge[]) => void;
};

const useDataStore = create<DataStoreState>((set) => ({
	holidays: [],
	workers: [],
	surcharges: [],
	records: [],
	properties: [],
	setSurcharges: (surcharges: Surcharge[]) => set({ surcharges }),
	setHolidays: (holidays: Holiday[]) => set({ holidays }),
	setWorkers: (workers: Worker[]) => set({ workers }),
	setRecords: (records: Record[]) => set({ records }),
	setProperties: (properties: Property[]) => set({ properties })
}));

export default useDataStore;
