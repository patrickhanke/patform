import React from 'react';
import styles from './Tally.module.scss';
import clsx from 'clsx';
import TallyName from './components/TallyName';
import SlideInContent from './components/SlideInContent';

const Tally = ({
    tallyId,
    tallyName,
}: {
    tallyId: string;
    tallyName: string;
}) => {
    return (
        <div className={clsx('content_element')}>
            <div className={styles.tally_container}>
                <TallyName tallyId={tallyId} />
                <SlideInContent
                    title={tallyName}
                    tallyId={tallyId}
                />
            </div>
        </div>
    );
};

export default Tally;
