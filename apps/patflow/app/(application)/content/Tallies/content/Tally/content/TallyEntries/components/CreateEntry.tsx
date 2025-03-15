import TextInput from '@/_UI/interfaces/TextInput';
import { UserContext } from '@repo/provider';
import React, { useContext, useState } from 'react';
import styles from '../TallyEntries.module.scss';
import clsx from 'clsx';
import { TallyTypes } from '@types';
import { v4 as uuidv4 } from 'uuid';

const CreateEntry = ({
    addEntryHandler,
}: {
    addEntryHandler: (newEntry: TallyTypes.Entry) => void;
}) => {
    const { user } = useContext(UserContext);
    const [comment, setComment] = useState('');
    const [entryValue, setEntryValue] = useState(NaN);

    return (
        <div className={styles.create_entry_container}>
            <TextInput
                defaultValue={comment}
                label="Zählerstand"
                id="value"
                type="number"
                onChange={value => setEntryValue(Number(value))}
                width="100%"
                min={0}
            />
            <TextInput
                defaultValue={comment}
                label="Kommentar"
                id="comment"
                onChange={value => setComment(value)}
                isTextArea
                width="100%"
            />

            <div className="button_container">
                <button
                    disabled={isNaN(entryValue) || entryValue < 0}
                    className={clsx('full_button', 'sm', 'dark')}
                    onClick={() => {
                        addEntryHandler({
                            id: uuidv4(),
                            user: user.objectId,
                            comment: comment,
                            date: new Date().toISOString(),
                            value: entryValue,
                        });
                        setComment('');
                        setEntryValue(NaN);
                    }}
                >
                    Zählerstand hinzufügen
                </button>
                <button
                    className={clsx('full_button', 'sm', 'light')}
                    onClick={() => {
                        setComment('');
                        setEntryValue(NaN);
                    }}
                >
                    Abbrechen
                </button>
            </div>
        </div>
    );
};

export default CreateEntry;
