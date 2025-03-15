'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styles from './Toggle.module.scss';
import { useDataHandler } from '@repo/provider';
import { useQuery } from '@apollo/client';
import { ToggleType } from './types';
import useToggleParameters from './hooks/useToggleParameters';
import { get } from 'lodash-es';

const Toggle = ({ objectId, type }: { objectId: string; type: ToggleType }) => {
    const { updateData } = useDataHandler();
    const [isChecked, setIsChecked] = useState(false);
    const { query, path, entry, className } = useToggleParameters(type);

    const { data, refetch } = useQuery(query, {
        variables: { id: objectId },
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (data) {
            setIsChecked(get(data, path));
        }
    }, [data]);

    const dataHandler = useCallback(async () => {
        await updateData({
            className,
            objectId,
            updateObject: {
                [entry]: !isChecked,
            },
        });
        refetch();
    }, [isChecked]);

    return (
        <div
            className={styles['toggle-container']}
            onClick={() => dataHandler()}
        >
            <div className={styles['toggle-switch']}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                />
                <span className={styles['toggle-slider']}></span>
            </div>
        </div>
    );
};

export default React.memo(Toggle);
