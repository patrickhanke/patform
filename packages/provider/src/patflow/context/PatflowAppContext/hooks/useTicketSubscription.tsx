"use client";

import { useCallback, useEffect } from "react";
import { Ticket } from "@repo/types";
import Parse from "../../../../general/data/parse";
import useDataStore from "./useDataStore";

const TICKET_PAGE_SIZE = 100;

const createProjectPointer = (projectId: string) => {
	const ProjectClass = Parse.Object.extend("Project");
	const projectPointer = new ProjectClass();
	projectPointer.id = projectId;

	return projectPointer;
};

const toTicket = (ticketObject: Parse.Object) =>
	({
		...ticketObject.toJSON(),
		objectId: ticketObject.id
	}) as Ticket;

const useTicketSubscription = (projectId?: string) => {
	const { setTickets } = useDataStore();

	const fetchTickets = useCallback(async () => {
		if (!projectId) {
			setTickets([]);
			return;
		}

		const TicketClass = Parse.Object.extend("Ticket");
		const projectPointer = createProjectPointer(projectId);
		const fetchedTickets: Ticket[] = [];
		let skip = 0;

		while (true) {
			const query = new Parse.Query(TicketClass);
			query.equalTo("project", projectPointer);
			query.limit(TICKET_PAGE_SIZE);
			query.skip(skip);
			query.descending("createdAt");

			const ticketPage = await query.find();
			fetchedTickets.push(...ticketPage.map(toTicket));

			if (ticketPage.length < TICKET_PAGE_SIZE) {
				break;
			}

			skip += TICKET_PAGE_SIZE;
		}

		setTickets(fetchedTickets);
	}, [projectId, setTickets]);

	useEffect(() => {
		void fetchTickets();
	}, [fetchTickets]);

	useEffect(() => {
		if (!projectId) {
			return;
		}

		let subscription: Parse.LiveQuerySubscription | undefined;
		let isCancelled = false;

		const TicketClass = Parse.Object.extend("Ticket");
		const projectPointer = createProjectPointer(projectId);
		const query = new Parse.Query(TicketClass);

		query.equalTo("project", projectPointer);

		const refreshTickets = () => {
			void fetchTickets();
		};

		const subscribeToChanges = async () => {
			try {
				subscription = await query.subscribe();

				if (isCancelled || !subscription) {
					return;
				}

				subscription.on("create", refreshTickets);
				subscription.on("update", refreshTickets);
				subscription.on("enter", refreshTickets);
				subscription.on("leave", refreshTickets);
				subscription.on("delete", refreshTickets);
			} catch (error) {
				console.error("Ticket subscription failed", error);
			}
		};

		void subscribeToChanges();

		return () => {
			isCancelled = true;
			if (subscription) {
				void subscription.unsubscribe();
			}
		};
	}, [fetchTickets, projectId]);
};

export default useTicketSubscription;
