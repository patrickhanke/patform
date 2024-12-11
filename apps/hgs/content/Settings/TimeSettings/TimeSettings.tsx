'use client';

import {SiteHeader} from '@content';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import site_states from './constants/site_states';
import { generateGraphQLQuery, useDataHandler, UserContext } from '@provider';
import SurchargeSettings from './content/SurchargeSettings';
import { SiteHeaderButtons } from '@/_UI/surfaces/SiteHeader';
import HolidayTemplates from './content/HolidayTemplates';
import Holidays from './content/Holidays';
import { useQuery } from '@apollo/client';
import { Holiday } from '@types';
import { cloneDeep, set } from 'lodash';
import axios from 'axios';

const TimeSettings = () => {
	const [siteState, setSiteState] = useState(site_states[0]);
	const {project} = useContext(UserContext);
	const [createTemplate, setCreateTemplate] = useState(false);
	const { data: holidayData, refetch: refetchHolidays } = useQuery(
		generateGraphQLQuery({type: 'find', objectName: 'Holiday', fields: ['objectId', 'name', 'label', 'type', 'dates']}),
		{
			variables:{params: {type: {_eq: 'holiday'}, project: {_eq: project?.objectId}}},
			skip: !project
		});

	const {updateData} = useDataHandler();


	const refreshHolidayDates = useCallback(async () => {
		const holidays = holidayData?.objects.findHoliday.results || [];

		
		const yearArray = [];

		for (let i = 0; i < 7; i+=1) {
			const year = new Date().getFullYear() + i;
			yearArray.push(year);
		}
		const returnObject: { [key: string]: { [key: string]: string } } = {};

		const getYears = yearArray.map( async year => {
			const response = await axios.get(`https://feiertage-api.de/api/?jahr=${year}`);
			const data = response.data;

			if (!data || typeof data !== 'object') {
				throw new Error('Invalid API response');
			}

			function findDatum(data: {[key: string] : object}) {
				const holidayObject = {};
				for (const region in data) {
					if (data[region]) {
						Object.assign(holidayObject, data[region]);
					}
				}
				return holidayObject;
			}
			const hdObject: {[key: string]: {datum: string}} = findDatum(data); 
			Object.keys(hdObject).forEach((holiday: keyof typeof hdObject) => {
				const holidayCopy = cloneDeep(returnObject[holiday]);
				const datum = hdObject[holiday].datum;
				set(returnObject, [holiday],{...holidayCopy, [year.toString()]: datum});
			});
		});

		await Promise.all(getYears);

		const updateHolidays = holidays.map((holiday: Holiday) => {
			const dates = returnObject[holiday.name];
			return updateData({
				className: 'Holiday',
				objectId: holiday.objectId,
				updateObject: {
					dates
				}
			});
		});
		
		await Promise.all(updateHolidays);
		await refetchHolidays();
		return returnObject;
	}, [refetchHolidays]);

	const siteHeaderButtons: SiteHeaderButtons = useMemo(() => {
		if (siteState.value === 'holiday-templates') {
			return [{
				text: 'Neues Feiertag-Template erstellen',
				onClick: () => {
					setCreateTemplate(true);
				},
				is_add_button: true,
				color: 'primary',
				disabled: false

			}];
		}
		if (siteState.value === 'holidays') {
			return [{
				text: 'Daten aktualisieren',
				onClick: () => {
					refreshHolidayDates();
				},
				is_add_button: false,
				color: 'primary',
				disabled: false

			}];
		}
		return [];
	}, [siteState]);

	return (
		<>
			<SiteHeader
				title="Zeiten und Zuschläge"
				hasSiteNavigation
				navItems={site_states}
				navCurrentItem={siteState}
				navOnClick={setSiteState}
				siteHeaderButtons={siteHeaderButtons}
			/>
			{siteState.value === 'holiday-templates' && (
				<HolidayTemplates 
					projectId={project.objectId} 
					createHolidayTemplate={createTemplate} 
					setCreateHolidayTemplate={setCreateTemplate}  
					holidays={holidayData?.objects.findHoliday.results || []}
				/>
			)}
			{siteState.value === 'holidays' && (
				<Holidays 
					holidays={holidayData?.objects.findHoliday.results || []} 
				/>
			)}
			{siteState.value === 'surcharges' && project &&  <SurchargeSettings projectId={project.objectId} holidays={holidayData?.objects.findHoliday.results || []} />}
		</>
	);
};

export default TimeSettings;