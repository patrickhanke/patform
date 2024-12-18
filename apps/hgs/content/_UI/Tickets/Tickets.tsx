'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import useGetTickets from './hooks/useGetTickets';
import styles from './Tickets.module.scss';
import { useDataHandler } from '@provider';
import { TicketsComponent } from './types';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import { Filter } from '@types';
import { useCallback } from 'react';
import useTicketColumns from './hooks/useTicketColumns';
import { Page, Table } from '@repo/ui';

const Tickets = ({id, className, pageState='open'}: TicketsComponent) => {
	const [filters, setFilters] = React.useState([] as Filter[]);
	const {loading: updateLoading} = useDataHandler();
	const {tickets, loading, refetch} = useGetTickets({id, className, filters});
	const searchParams = useSearchParams();
	const router = useRouter();
	const {updateData, deleteData} = useDataHandler();

	const archiveTicket = useCallback(async (objectId: string) => {
		await updateData({
			className: 'Ticket',
			objectId,
			updateObject: {	
				archived: true
			}
		});
		refetch();
	}, []);

	const deleteTicket = useCallback(async (objectId: string) => {
		await deleteData({
			className: 'Ticket',
			objectId
		});
		refetch();
	}, []);

	const columns = useTicketColumns({refetch, archiveTicket, deleteTicket});

	const initialFilters: () => Filter[] = useCallback(() => {
		if (pageState === 'open') {
			return([
				{key: 'state', value: 'open', operator: '_in', id: 'state'}
			]);
		} else if (pageState === 'in_progress') {
			return([{key: 'state', value: 'in_progress', operator: '_eq', id: 'state'}]);
		} else if (pageState === 'closed') {
			return([{key: 'state', value: 'closed', operator: '_eq', id: 'state'}]);
		}
		if (searchParams.get('ticket')) {
			return([{key: 'objectId', value: searchParams.get('ticket') as string, operator: '_eq', id: 'objectId'}]);
		}
		return [];
	}, [pageState, searchParams.get('ticket')]);

	const siteHeaderButtons = useMemo(() => [{
		type: 'button',
		text: 'Filter zurücksetzen',
		onClick: () => {
			if (searchParams.get('ticket')) {
				router.push('/tickets');
			}
			setFilters(initialFilters());
		},
		color: 'secondary',
		is_reset_button: true,
		disabled: loading || updateLoading || filters.length === 0
	}], [loading, updateLoading, filters]);

	const siteContent = useMemo(() => {
			let content =  {
				title: 'Tickets',
				description: ''
			}
			if (pageState === 'open') {
				content.title =  'Aktive Tickets';
				content.description = 'Hier finden Sie alle Tickets, die noch nicht erledigt sind.';
			} else if (pageState === 'in_progress') {
				content.title =  'Ausgeführte Tickets';
				content.description = 'Hier finden Sie alle ausgeführten Tickets.';
			} else if (pageState === 'closed') {
				content.title =  'Erledigte Tickets';
				content.description = 'Hier finden Sie alle erledigten Tickets.';
			} else if (pageState === 'archived') {
				content.title =  'Archivierte Tickets';
				content.description = 'Hier finden Sie alle archivierten Tickets.';
			}
	
			return content;
		}, [pageState])

	useEffect(() => {
		setFilters(initialFilters());
	}, [searchParams.get('ticket'), pageState]);

	const siteHeaderContent = useMemo(() => (
		<Suspense fallback={<div>Loading...</div>}>
			<SiteHeaderContent
				id={id}
				filters={filters}
				setFilters={setFilters}
				tickets={tickets || []}
			/>
		</Suspense>
	), [filters, tickets]);

	return (
		<Page 
			title={siteContent.title}
			description={siteContent.description}
			refetch={refetch}
		>
			<div className={clsx(styles.ticket_overview)}>
				{siteHeaderContent}
					<Table
						columns={columns}
						data={tickets ? tickets : []}
					/>
			</div>
		</Page>
	);
};

export default Tickets;