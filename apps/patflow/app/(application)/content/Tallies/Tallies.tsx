import React, { useMemo } from 'react';
import useFindTallies from './hooks/useFindTallies';
import { TalliesComponent } from './types';
import styles from './Tallies.module.scss';
import Tally from './content/Tally';
import { useDataHandler } from '@repo/provider';
import clsx from 'clsx';

const Tallies = ({ id, className }: TalliesComponent) => {
    const { createData, loading: updateLoading } = useDataHandler();
    const { tallies, loading, refetch } = useFindTallies({ id, className });

    const siteHeaderButtons = useMemo(
        () => [
            {
                type: 'button',
                text: 'Neue Zählereintrag ersellen',
                onClick: () =>
                    createData({
                        className: 'Tally',
                        updateObject: {
                            name: 'Neuer Zählereintrag',
                            entries: [],
                            description: '',
                            property: {
                                __type: 'Pointer',
                                className: 'Property',
                                objectId: id,
                            },
                        },
                        afterSaveHandler: () => refetch(),
                    }),
                is_add_button: true,
                color: 'secondary',
                disabled: loading || updateLoading,
            },
        ],
        [loading, updateLoading]
    );

    return (
        <>
            <div className={clsx('site_content')}>
                <div className={styles.tallies_container}>
                    {tallies &&
                        tallies.map((tally: object) => (
                            <Tally
                                key={tally.objectId}
                                tallyName={tally.name}
                                tallyId={tally.objectId}
                            />
                        ))}
                </div>
            </div>
        </>
    );
};

export default Tallies;
