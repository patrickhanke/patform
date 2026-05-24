import { create } from "zustand";
import { AbsenceDataStore, DataStoreState, RecordDataStore } from "../types";
import { Filter } from "@repo/types";
import dataFilterHandler from "../functions/dataFilterHandler";

const useDataStore = create<DataStoreState>((set, get) => ({
	holidays: [],
	absences: [],
	workers: [],
	surcharges: [],
	records: [],
	properties: [],
	tasks: [],
	tickets: [],
	services: [],
	servicesUpdatedAt: null,
	holidaysUpdatedAt: null,
	absencesUpdatedAt: null,
	workersUpdatedAt: null,
	recordsUpdatedAt: null,
	propertiesUpdatedAt: null,
	surchargesUpdatedAt: null,
	tasksUpdatedAt: null,
	ticketsUpdatedAt: null,
	setServices: (services) => set({ services, servicesUpdatedAt: Date.now() }),
	setSurcharges: (surcharges) => set({ surcharges, surchargesUpdatedAt: Date.now() }),
	setHolidays: (holidays) => set({ holidays, holidaysUpdatedAt: Date.now() }),
	setWorkers: (workers) => set({ workers, workersUpdatedAt: Date.now() }),
	setRecords: (records: RecordDataStore[]) => set({ records, recordsUpdatedAt: Date.now() }),
	setAbsences: (absences: AbsenceDataStore[]) => set({ absences, absencesUpdatedAt: Date.now() }),
	setProperties: (properties) => set({ properties, propertiesUpdatedAt: Date.now() }),
	setTasks: (tasks) => set({ tasks, tasksUpdatedAt: Date.now() }),
	setTickets: (tickets) => set({ tickets, ticketsUpdatedAt: Date.now() }),
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
