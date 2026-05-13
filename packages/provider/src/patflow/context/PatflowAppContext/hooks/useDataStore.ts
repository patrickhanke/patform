import { create } from "zustand";
import { DataStoreState } from "../types";
import { Filter, Record } from "@repo/types";
import dataFilterHandler from "../functions/dataFilterHandler";

const useDataStore = create<DataStoreState>((set, get) => ({
	holidays: [],
	workers: [],
	surcharges: [],
	records: [],
	properties: [],
	tasks: [],
	tickets: [],
	services: [],
	setServices: (services) => set({ services }),
	setSurcharges: (surcharges) => set({ surcharges }),
	setHolidays: (holidays) => set({ holidays }),
	setWorkers: (workers) => set({ workers }),
	setRecords: (records: Record[]) => set({ records }),
	setProperties: (properties) => set({ properties }),
	setTasks: (tasks) => set({ tasks }),
	setTickets: (tickets) => set({ tickets }),
	getTasks: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) =>
		get()
			.tasks.filter((task) => {
				let match = true;
				if (filters.length > 0) {
					match = dataFilterHandler(task, filters);
				}
				if (propertyId) {
					if (task.property?.objectId !== propertyId) {
						match = false;
					}
				}
				return match;
			})
			.slice(skip, skip + limit),
	getTickets: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) =>
		get()
			.tickets.filter((ticket) => {
				let match = true;
				if (filters.length > 0) {
					match = dataFilterHandler(ticket, filters);
				}
				if (propertyId) {
					if (ticket.property?.objectId !== propertyId) {
						match = false;
					}
				}
				return match;
			})
			.slice(skip, skip + limit),
	getServices: (
		filters: Filter[],
		skip: number,
		limit: number,
		propertyId?: string
	) => {
		const services = get().services;

		return services
			.filter((service) => {
				let match = true;
				if (filters.length > 0) {
					match = dataFilterHandler(service, filters);
				}
				if (propertyId) {
					if (service?.property?.objectId !== propertyId) {
						match = false;
					}
				}
				return match;
			})
			.slice(skip, skip + limit);
	}
}));

export default useDataStore;
