import { useQuery } from '@apollo/client';
import { ElementSelectInterface } from '@repo/ui';
import { Task, Ticket } from '@types';
import React, { FC, useMemo } from 'react';
import { SelectTicketProps, TicketOption } from '../types';
import styles from '../CreateTask.module.scss';
import { generateGraphQLQuery, paramsHandler } from '@repo/provider';

export const DisplayTicket = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => (
    <div className={styles.ticket_container}>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const SelectTicket: FC<SelectTicketProps> = ({
    projectId,
    setTask,
    task,
    showTicketOnly = false,
}) => {
    const query = generateGraphQLQuery({
        type: 'find',
        objectName: 'Ticket',
        fields: [
            'objectId',
            'title',
            'description',
            'state',
            'images',
            'property {objectId name}',
            'task {objectId title}',
        ],
    });

    const variables = paramsHandler({
        projectId,
        filters: [
            { key: 'state', value: 'closed', operator: '_ne', id: 'state' },
        ],
    });

    const { data: ticketData } = useQuery(query, {
        variables: { params: variables },
        notifyOnNetworkStatusChange: true,
    });

    const elements = useMemo(() => {
        const ticketOptionsArray: TicketOption[] = [];
        if (ticketData) {
            ticketData.objects.findTicket.results.forEach((ticket: Ticket) => {
                if (ticket && !ticket?.task?.objectId) {
                    ticketOptionsArray.push({
                        value: ticket.objectId,
                        id: ticket.objectId,
                        label: ticket.title,
                        description: ticket.description,
                        header: ticket.property.name,
                        element: (
                            <DisplayTicket
                                title={ticket.title}
                                description={ticket.description}
                            />
                        ),
                    });
                }
            });
        }

        ticketOptionsArray.sort((a, b) => a.header?.localeCompare(b.header));
        return ticketOptionsArray;
    }, [ticketData]);

    if (showTicketOnly) {
        const ticket = elements.find(el => el.value === task.ticket);
        if (!ticket) {
            return null;
        }
        return (
            <DisplayTicket
                title={ticket?.label}
                description={ticket?.description}
            />
        );
    }

    return (
        <ElementSelectInterface
            title="Ticket auswählen"
            elements={elements}
            isSearchable
            selectedElements={elements.filter(el => el.value === task.ticket)}
            onSelect={values => {
                if (values.length > 0) {
                    setTask((task: Task) => ({
                        ...task,
                        ticket: values[0].value,
                    }));
                } else if (values.length === 0 && task.ticket) {
                    setTask((task: Task) => ({
                        ...task,
                        ticket: undefined,
                    }));
                }
            }}
        />
    );
};

export default SelectTicket;
