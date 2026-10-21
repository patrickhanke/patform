"use client";

import { useCallback, useEffect } from "react";
import { Absence } from "@repo/types";
import Parse from "./parse";
import useDataStore from "./useDataStore";
import { AbsenceDataStore } from "../types";

const ABSENCE_PAGE_SIZE = 100;

const createProjectPointer = (projectId: string) => {
	const ProjectClass = Parse.Object.extend("Project");
	const projectPointer = new ProjectClass();
	projectPointer.id = projectId;

	return projectPointer;
};

const toAbsence = (absenceObject: Parse.Object): AbsenceDataStore => {
	const absence = {
		...absenceObject.toJSON(),
		objectId: absenceObject.id
	} as Absence;

	return {
		...absence,
		value: absence.objectId,
		label: absence.objectId
	};
};

const useAbsenceSubscription = (projectId?: string) => {
	const { setAbsences } = useDataStore();

	const fetchAbsences = useCallback(async () => {
		if (!projectId) {
			setAbsences([]);
			return;
		}

		const AbsenceClass = Parse.Object.extend("Absence");
		const projectPointer = createProjectPointer(projectId);
		const fetchedAbsences: AbsenceDataStore[] = [];
		let skip = 0;

		while (true) {
			const query = new Parse.Query(AbsenceClass);
			query.equalTo("project", projectPointer);
			query.limit(ABSENCE_PAGE_SIZE);
			query.skip(skip);
			query.descending("createdAt");

			const absencePage = await query.find();
			fetchedAbsences.push(...absencePage.map(toAbsence));

			if (absencePage.length < ABSENCE_PAGE_SIZE) {
				break;
			}

			skip += ABSENCE_PAGE_SIZE;
		}

		setAbsences(fetchedAbsences);
	}, [projectId, setAbsences]);

	useEffect(() => {
		void fetchAbsences();

		if (!projectId) {
			return;
		}

		const intervalId = window.setInterval(() => {
			void fetchAbsences();
		}, 30_000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [fetchAbsences, projectId]);

	return {
		fetchAbsences
	};
};

export default useAbsenceSubscription;
