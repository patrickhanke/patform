'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import useGetTickets from './hooks/useGetTickets';
import styles from './Tickets.module.scss';
import { useDataHandler } from '@/provider';
import { TicketsComponent } from './types';
import SiteHeader from '@/_UI/surfaces/SiteHeader';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeaderContent from './components/SiteHeaderContent';
import { Filter } from '@/types';
import { useCallback } from 'react';
import { Table } from '@/_UI/surfaces';
import useTicketColumns from './hooks/useTicketColumns';

const Tickets = ({id, className, siteType='open'}: TicketsComponent) => {
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
		if (siteType === 'open') {
			return([
				{key: 'state', value: 'open', operator: '_in', id: 'state'}
			]);
		} else if (siteType === 'in_progress') {
			return([{key: 'state', value: 'in_progress', operator: '_eq', id: 'state'}]);
		} else if (siteType === 'closed') {
			return([{key: 'state', value: 'closed', operator: '_eq', id: 'state'}]);
		}
		if (searchParams.get('ticket')) {
			return([{key: 'objectId', value: searchParams.get('ticket') as string, operator: '_eq', id: 'objectId'}]);
		}
		return [];
	}, [siteType, searchParams.get('ticket')]);

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

	useEffect(() => {
		setFilters(initialFilters());
	}, [searchParams.get('ticket'), siteType]);

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
		<>
			<SiteHeader 
				isSubHeader
				siteHeaderContent={siteHeaderContent}
				siteHeaderButtons={siteHeaderButtons}
				refetch={refetch}
			/>
			<div className={clsx('site_content', styles.ticket_overview)}>
				<div className={clsx('content_element', 'no_padding', styles.tickets_container)}>
					<Table
						columns={columns}
						data={tickets ? tickets : []}
					/>
					
					{/* {tickets && sortArrayForDivider(tickets, 'createdAt').map((ticket, index) => 
						<Ticket
							key={ticket.objectId}
							showDivider={index === 0 || ticket.divider ||  false}
							ticketId={ticket.objectId}
							refetchTickets={refetch}
						/>
					)} */}
				</div>
			</div>
		</>
	);
};

export default Tickets;