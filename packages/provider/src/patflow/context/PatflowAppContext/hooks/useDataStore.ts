import { create } from "zustand";
import { Holiday, PatflowUser, Property, Record, Surcharge } from "@repo/types";

export type DataStoreState = {
	holidays: Holiday[];
	workers: PatflowUser[];
	records: Record[];
	properties: Property[];
	surcharges: Surcharge[];
	setHolidays: (holidays: Holiday[]) => void;
	setWorkers: (workers: PatflowUser[]) => void;
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
	setWorkers: (workers: PatflowUser[]) => set({ workers }),
	setRecords: (records: Record[]) => set({ records }),
	setProperties: (properties: Property[]) => set({ properties })
}));

export default useDataStore;
