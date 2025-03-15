import React, { useMemo } from 'react';
import { Property, StaffMember } from '@types';
import { FIND_ALL_PROPERTY, FIND_ALL_STAFF } from '@queries';
import { useQuery } from '@apollo/client';
import { SiteHeaderContentComponent } from '../types';
import styles from '../WeeklyRecords.module.scss';
import { filterChangeHandler } from '@provider';
import { Select } from '@content';
import { differenceInCalendarWeeks } from 'date-fns';

const SiteHeaderContent = ({
    id,
    filters,
    setFilters,
    setSelectedWeek,
    selectedWeek,
}: SiteHeaderContentComponent) => {
    const { data: objectData } = useQuery(FIND_ALL_PROPERTY, {
        skip: !!id,
    });

    const { data: staffData } = useQuery(FIND_ALL_STAFF);
    const selectOptions = useMemo(() => {
        let objectOptions = [] as { value: string; label: string }[];
        let staffOptions = [] as { value: string; label: string }[];

        if (objectData) {
            objectOptions = objectData.objects.findProperty.results.map(
                (property: Property) => ({
                    value: property.objectId,
                    label: property.name,
                })
            );
        }
        if (staffData) {
            staffOptions = staffData.objects.find_User.results.map(
                (staff: StaffMember) => ({
                    value: staff.objectId,
                    label: `${staff.first_name} ${staff.family_name}`,
                })
            );
        }

        return { objectOptions, staffOptions };
    }, [objectData, staffData]);

    const weekOptions = useMemo(() => {
        const year = new Date().getFullYear();
        const difference = differenceInCalendarWeeks(
            new Date(year, 12, 31),
            new Date(year, 1, 1),
            { weekStartsOn: 1 }
        );

        const weeks = Array.from({ length: difference }, (_, i) => i + 1);

        return weeks.map(week => ({ value: week, label: `KW ${week}` }));
    }, []);

    return (
        <div className={styles.siteheader_content}>
            <Select
                label=""
                width="90px"
                options={weekOptions}
                value={selectedWeek}
                onChange={value => setSelectedWeek(value?.value)}
                placeholder="KW..."
            />

            {staffData && (
                <Select
                    label=""
                    width="150px"
                    options={selectOptions.staffOptions}
                    value={
                        filters.find(
                            filterElement => filterElement.key === 'user'
                        )?.value || null
                    }
                    onChange={value =>
                        setFilters(
                            filterChangeHandler(
                                'user',
                                value?.value,
                                '_in',
                                filters
                            )
                        )
                    }
                    placeholder="Mitarbeiter..."
                    isClearable
                />
            )}
        </div>
    );
};

export default SiteHeaderContent;
