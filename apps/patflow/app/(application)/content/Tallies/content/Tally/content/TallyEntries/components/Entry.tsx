import { TallyTypes } from '@types';
import React from 'react';
import styles from '../TallyEntries.module.scss';
import { DateDisplay, DisplayWorker } from '@content';
import { PiClockCountdown } from 'react-icons/pi';
import { useQuery } from '@apollo/client';
import { GET_USER_DISPLAY_DATA } from '@queries';
import { LiaCommentDots } from 'react-icons/lia';

const Entry = ({ entry }: { entry: TallyTypes.Entry }) => {
    const { data } = useQuery(GET_USER_DISPLAY_DATA, {
        variables: { id: entry.user },
    });

    return (
        <div className={styles.entry_container}>
            <div className={styles.entry_header}>
                {data && <DisplayWorker worker={data.objects.get_User} />}
                <DateDisplay
                    date={entry.date}
                    displayType="date-and-time"
                />
            </div>
            <div className={styles.entry_content}>
                <div className={styles.entry_content_icon}>
                    <PiClockCountdown />
                </div>
                <div className={styles.entry_content_text}>
                    <p>{entry.value}</p>
                </div>
            </div>
            {entry.comment && (
                <div className={styles.entry_content}>
                    <div className={styles.entry_content_icon}>
                        <LiaCommentDots />
                    </div>
                    <div className={styles.entry_content_text}>
                        <p>{entry.comment}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Entry;
