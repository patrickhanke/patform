'use client';

import React, { FC, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { SelectType } from './types';
import styles from './Select.module.scss';
import customStyles from './constants/styles';
import { ErrorDisplay } from '@repo/ui';

const Select: FC<SelectType> = ({
    onChange,
    value,
    placeholder,
    options,
    isMulti = false,
    isDisabled = false,
    isClearable = false,
    label,
    id,
    errors,
    width = 150,
    menuPosition = 'fixed',
}) => {
    const [_doc, setDoc] = useState<HTMLElement | null>(null);

    const valueBoundryHandler = (value: object | string | null) => {
        if (typeof value === 'object' && value !== null) {
            return value;
        } else if (typeof value === 'string' || typeof value === 'number') {
            return options?.find(option => option.value === value) || null;
        }
        return value;
    };

    useEffect(() => {
        const element = document?.body;
        if (element) {
            setDoc(element);
        }
    }, []);

    return (
        <>
            {label && <label htmlFor={id}>{label}</label>}
            <ReactSelect
                id={id}
                value={valueBoundryHandler(value)}
                onChange={(inputValue, action) => onChange(inputValue, action)}
                options={options}
                isMulti={isMulti}
                isDisabled={isDisabled}
                isClearable={isClearable}
                placeholder={placeholder}
                className={styles.react_select_container}
                classNamePrefix="react-select"
                styles={customStyles({ width })}
                // menuPortalTarget={doc}
                menuPosition={menuPosition}
                menuPlacement="auto"
            />
            <ErrorDisplay
                errors={errors}
                id={id}
            />
        </>
    );
};

export default Select;
