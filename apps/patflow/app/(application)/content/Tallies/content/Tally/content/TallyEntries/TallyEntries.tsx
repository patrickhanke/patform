import { useDataHandler } from '@repo/provider';
import { TallyTypes, TaskTypes } from '@types';
import React, { useCallback } from 'react';
import styles from './TallyEntries.module.scss';
import CreateEntry from './components/CreateEntry';
import Entry from './components/Entry';
import getSortedEntries from './functions/getSortedEntries';
import { Loader } from '@repo/ui';

const TallyEntries = ({
    tallyId,
    entries,
    refetch,
}: {
    tallyId: string;
    entries: TallyTypes.Entry[];
    refetch: () => void;
}) => {
    const { updateData } = useDataHandler();

    const addEntryHandler = useCallback(
        async (newEntry: TallyTypes.Entry) => {
            const entriesCopy = [...entries];
            entriesCopy.push(newEntry);

            await updateData({
                className: 'Tally',
                objectId: tallyId,
                updateObject: {
                    entries: entriesCopy,
                },
            });
            refetch();
        },
        [entries.length, tallyId]
    );

    if (entries)
        return (
            <>
                <div className={styles.task_slidein_content_container}>
                    {getSortedEntries(entries).map(
                        (entry: TallyTypes.Entry) => (
                            <Entry
                                key={entry.id}
                                entry={entry}
                            />
                        )
                    )}
                </div>
                <div className={styles.task_slidein_footer}>
                    <CreateEntry addEntryHandler={addEntryHandler} />
                </div>
            </>
        );
    return (
        <Loader
            width="100%"
            height="120px"
        />
    );
};

export default TallyEntries;
