import {
    AppContext,
    getDateFromWeek,
    getDateStringsFromIso,
    useGetActiveRecord,
    weekdays,
} from '@provider';
import {
    format,
    formatISO9075,
    getDay,
    millisecondsToMinutes,
    minutesToMilliseconds,
} from 'date-fns';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { EditTimeProps, WorkingTime } from '../types';
import styles from '../EditRecord.module.scss';
import { useDebounceCallback } from 'usehooks-ts';
import { cloneDeep } from 'lodash-es';
import { SwitchButton as SwitchButtonType } from '@types';
import { Select } from '@content';
import { Modal } from '@repo/ui';

const EditTime = ({
    day,
    timeChangeHandler,
    workingTimes,
    selectedWeek,
    deleteDay,
    userId,
}: EditTimeProps) => {
    const { year } = useContext(AppContext);
    const { record } = useGetActiveRecord({ year, userId });
    const [deleteModal, setDeleteModal] = useState(false);

    const updateHandler = useCallback(
        (
            key: 'start' | 'end' | 'pause' | 'comment' | 'date',
            value: string
        ) => {
            const dayCopy: WorkingTime = cloneDeep(day);
            if (!dayCopy.time || !record) {
                return;
            }
            if (key === 'start' || key === 'end') {
                const date = new Date(dayCopy.date as string);
                const hours = value.split(':')[0];
                const minutes = value.split(':')[1];
                date.setHours(Number(hours));
                date.setMinutes(Number(minutes));
                const newDate = date.toISOString();

                dayCopy.time[key] = newDate;
            }
            if (key === 'pause') {
                const pauseValue = minutesToMilliseconds(Number(value));
                dayCopy.time.pause = pauseValue;
            }
            if (key === 'comment') {
                dayCopy.time.comment = value;
            }
            if (key === 'date') {
                dayCopy.date = value;
                dayCopy.record = record;
            }
            timeChangeHandler(dayCopy);
        },
        [day]
    );

    const debounced = useDebounceCallback(updateHandler, 600);

    const weekdayHandler = useCallback(
        (weekday: (typeof weekdays)[number]) => {
            const date = formatISO9075(
                getDateFromWeek(selectedWeek, weekday.index),
                { representation: 'date' }
            );
            const string = format(new Date(date), 'dd.MM.yyyy');

            let isAbsence = false;
            workingTimes.forEach(day => {
                if (day.date === date && day.type === 'absence') {
                    isAbsence = true;
                }
            });
            const label = `${weekday.label} - ${isAbsence ? 'Abwesend' : string}`;
            return { isAbsence, date, label };
        },
        [workingTimes, day, selectedWeek]
    );

    const dateSelectButtons = useMemo(
        () =>
            weekdays.map(weekday => ({
                label: weekdayHandler(weekday).label,
                value: weekdayHandler(weekday).date,
                isDisabled: weekdayHandler(weekday).isAbsence,
            })),
        []
    );

    return (
        <div>
            <div>
                <h3>
                    {day.date
                        ? `${weekdays.find(weekday => weekday.day === getDay(new Date(day.date)))?.label} - ${getDateStringsFromIso(formatISO9075(new Date(day.date))).date} `
                        : 'Bitte Datum auswählen'}
                </h3>
            </div>
            <form
                className={styles.edit_time_form}
                action=""
            >
                <div className="row_container">
                    <label htmlFor={'date'}>Tag</label>
                    <Select
                        id="date"
                        width={'180px'}
                        options={dateSelectButtons}
                        onChange={value =>
                            debounced('date', value.value as string)
                        }
                        value={
                            dateSelectButtons.find(
                                button => button.value === day.date
                            ) as SwitchButtonType
                        }
                    />
                </div>
                <div className="row_container">
                    <label htmlFor={'start'}>Start</label>
                    <input
                        aria-label="Time"
                        id={'start'}
                        name={'start'}
                        type="time"
                        // onChange={(e) => timeChangeHandler(dayKey as string, {...time, start: e.target.value as D})}
                        onChange={e => debounced('start', e.target.value)}
                        defaultValue={
                            day.time?.start
                                ? formatISO9075(day.time.start, {
                                      representation: 'time',
                                  }).slice(0, 5)
                                : ''
                        }
                        step={undefined}
                        disabled={!day.date}
                    />
                </div>
                <div className="row_container">
                    <label htmlFor={'end'}>Ende</label>
                    <input
                        aria-label="Time"
                        id={'end'}
                        name={'end'}
                        type="time"
                        onChange={e => debounced('end', e.target.value)}
                        defaultValue={
                            day.time?.end
                                ? formatISO9075(day.time.end, {
                                      representation: 'time',
                                  }).slice(0, 5)
                                : ''
                        }
                        step={undefined}
                        disabled={!day.date}
                    />
                </div>
                <div className="row_container">
                    <label htmlFor={'pause'}>Pause</label>
                    <input
                        aria-label="Time"
                        id={'pause'}
                        name={'pause'}
                        type="number"
                        onChange={e => debounced('pause', e.target.value)}
                        defaultValue={millisecondsToMinutes(
                            day.time?.pause || 0
                        )}
                        step={undefined}
                        disabled={false}
                    />
                </div>
                <div>
                    <label htmlFor="comments">Kommentar</label>
                    <textarea
                        style={{ width: '100%' }}
                        id={'comment'}
                        name={'comment'}
                        onChange={e => debounced('comment', e.target.value)}
                        defaultValue={day.time?.comment}
                        disabled={!day.date}
                    />
                </div>
            </form>
            <button
                className="full_button md red"
                onClick={() => setDeleteModal(true)}
            >
                löschen
            </button>
            <Modal
                header="Zeit löschen"
                isOpen={deleteModal}
                confirmButtonHandler={() => {
                    if (day.objectId) {
                        deleteDay('objectId', day.objectId as string);
                    } else if (day.id) {
                        deleteDay('id', day.id);
                    }
                }}
                cancelButtonHandler={() => {
                    setDeleteModal(false);
                }}
            >
                <p>Sind Sie sicher, dass Sie die Zeit löschen möchten?</p>
            </Modal>
        </div>
    );
};

export default EditTime;
