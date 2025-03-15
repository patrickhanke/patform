import { DisplayUserDataProps } from '@types';
import React from 'react';
import styles from '../StaffMemberOverview.module.scss';

const DisplayUserData = ({ label, value }: DisplayUserDataProps) => {
    const valueRenderHandler = (renderValue: DisplayUserDataProps['value']) => {
        if (typeof renderValue === 'string') {
            return renderValue;
        }
        return null;
    };
    return (
        <div className={styles.user_data_element}>
            <div className="label">{label}</div>
            <div>
                <p>{valueRenderHandler(value)}</p>
            </div>
        </div>
    );
};

export default DisplayUserData;
