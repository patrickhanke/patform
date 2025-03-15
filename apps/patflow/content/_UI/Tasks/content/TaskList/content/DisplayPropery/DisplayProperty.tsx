import React from 'react';
import styles from './DisplayProperty.module.scss';
import { useQuery } from '@apollo/client';
import { GET_TASK_PROPERTY } from '@queries';
import { Loader, StateSelect } from '@repo/ui';

const DisplayProperty = ({ taskId }: { taskId: string }) => {
    const { data } = useQuery(GET_TASK_PROPERTY, {
        variables: { id: taskId },
    });

    if (data)
        return (
            <div className={styles.object_container}>
                <StateSelect
                    type="label"
                    color="light"
                    label={
                        data.objects.getTask.property?.name ||
                        'Kein Objekt zugewiesen'
                    }
                    icon="house"
                    noBackground
                />
            </div>
        );

    return (
        <Loader
            width="30px"
            height="18px"
        />
    );
};

export default DisplayProperty;
