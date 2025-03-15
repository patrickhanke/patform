import React, { useCallback } from 'react';
import { MultiDateSelectInterfaceProps } from '../types';
import { formatISO9075 } from 'date-fns';
import getUpcomingDates from '../functions/getUpcomingDates';
import { DateObjectWithNextDates } from '@types';
import { CreateButton, DatePicker } from '@repo/ui';

const MultiDateSelectInterface = ({
    date,
    category,
    onChange,
}: MultiDateSelectInterfaceProps) => {
    const dateTransformHandler = useCallback(
        (dateString: string, index?: number) => {
            const datesCopy = [...date.dates];
            if (category === 'opportunity') {
                if (typeof index === 'number') {
                    datesCopy[index] = dateString;
                } else {
                    datesCopy.push(dateString);
                }
            }

            if (category === 'fixed') {
                if (typeof index === 'number') {
                    datesCopy[index] = dateString;
                } else {
                    datesCopy.push(dateString);
                }
            }

            const dateObject: DateObjectWithNextDates = {
                ...date,
                dates: [...datesCopy],
                next_dates: getUpcomingDates(datesCopy).map(dateString =>
                    formatISO9075(new Date(dateString), {
                        representation: 'date',
                    })
                ),
            };

            onChange(dateObject);
        },
        [date, category]
    );

    return (
        <>
            <h3>Individuelle Daten</h3>
            {date?.dates.map((date: string, index: number) =>
                category === 'opportunity' ? (
                    <div
                        className="row_container"
                        key={date}
                    >
                        <DatePicker
                            defaultValue={date}
                            onChange={value =>
                                dateTransformHandler(value, index)
                            }
                            type="week"
                            label="Woche wählen"
                            id="week"
                        />
                    </div>
                ) : (
                    <div
                        className="row_container"
                        key={date}
                    >
                        <DatePicker
                            defaultValue={date || ''}
                            onChange={value =>
                                dateTransformHandler(value, index)
                            }
                            type="datetime-local"
                            label="Termin wählen"
                            id="date"
                        />
                    </div>
                )
            )}
            <CreateButton
                text="Neues Datum hinzufügen"
                size="small"
                onClick={() => dateTransformHandler('')}
                disabled={date.dates.includes('')}
            />
        </>
    );
};

export default MultiDateSelectInterface;
