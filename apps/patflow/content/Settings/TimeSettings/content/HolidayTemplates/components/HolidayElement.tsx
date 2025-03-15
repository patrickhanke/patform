import React, { useState } from 'react';
import { HolidayElementProps } from '../types';
import styles from '../Holiday.module.scss';
import { IconButton, StatelessToggle } from '@content';
import { useImmer } from 'use-immer';

const HolidayElement = ({
    holiday,
    index,
    holidayChangeHandler,
}: HolidayElementProps) => {
    const [edit, setEdit] = useState(false);
    // const [delete, setDelete] = useState(false);

    const initialState = {
        edit: false,
        name: holiday.name,
        date: holiday.date,
    };

    const [state, updateState] = useImmer(initialState);

    const resetState = () => {
        updateState(() => initialState);
    };

    const toggleEdit = () => {
        updateState(draft => {
            draft.edit = !draft.edit;
        });
    };

    const setName = (name: string) => {
        updateState(draft => {
            draft.name = name;
        });
    };

    const setDate = (date: string) => {
        updateState(draft => {
            draft.date = date;
        });
    };

    return (
        <div className={styles.holiday_element_container}>
            {edit ? (
                <input
                    value={state.name}
                    onChange={e => setName(e.target.value)}
                />
            ) : (
                <h3>{state.name}</h3>
            )}
            {edit ? (
                <input
                    value={state.date}
                    onChange={e => setDate(e.target.value)}
                />
            ) : (
                <p>{state.date}</p>
            )}
            <StatelessToggle
                value={holiday.active}
                onChange={() => toggleEdit()}
                disabled={!edit}
            />
            {edit ? (
                <div className="button_container">
                    <IconButton
                        icon="save"
                        onClick={() => {
                            holidayChangeHandler(index, state, state.name);
                            setEdit(!edit);
                        }}
                    />
                    <IconButton
                        icon="cancel"
                        onClick={() => {
                            resetState();
                            setEdit(!edit);
                        }}
                    />
                </div>
            ) : (
                <div className="button_container">
                    <IconButton
                        icon="edit"
                        onClick={() => setEdit(!edit)}
                    />
                    <IconButton
                        icon="delete"
                        onClick={() => {}}
                    />
                </div>
            )}
        </div>
    );
};

export default HolidayElement;
