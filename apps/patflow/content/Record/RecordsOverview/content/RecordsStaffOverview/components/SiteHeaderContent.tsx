import React, { useMemo } from 'react';
import { StaffMember } from '@types';
import { FIND_ALL_STAFF } from '@queries';
import { useQuery } from '@apollo/client';
import { SiteHeaderContentProps } from '../types';
import styles from '../RecordsStaffOverview.module.scss';
import { months } from '@provider';
import { Loader } from 'lucide-react';
import { Select, SwitchButtons } from '@repo/ui';

const SiteHeaderContent = ({
    selectedMonth,
    setSelectedMonth,
    selectedUser,
    setSelectedUser,
    displayStates,
    setDisplayState,
    displayState,
}: SiteHeaderContentProps) => {
    const { data: staffData } = useQuery(FIND_ALL_STAFF);

    const selectOptions = useMemo(() => {
        let staffOptions = [] as { value: string; label: string }[];
        const monthOptions = [
            { value: 'all', label: 'Alle Monate' },
            ...months,
        ];
        if (staffData) {
            staffOptions = staffData.objects.find_User.results.map(
                (staff: StaffMember) => ({
                    value: staff.objectId,
                    label: `${staff.first_name} ${staff.family_name}`,
                    ...staff,
                })
            );
        }

        return { staffOptions, monthOptions };
    }, [staffData]);

    return (
        <div className={styles.siteheader_content}>
            <div className="button_container">
                <SwitchButtons
                    buttonStates={displayStates}
                    currentStates={displayState}
                    changeHandler={(
                        value: SiteHeaderContentProps['displayState']
                    ) => {
                        setDisplayState(value);
                    }}
                />
                {staffData ? (
                    <Select
                        label=""
                        width="150px"
                        options={selectOptions.staffOptions}
                        value={selectedUser}
                        onChange={value => setSelectedUser(value)}
                        placeholder="Mitarbeiter..."
                        isClearable
                    />
                ) : (
                    <Loader
                        height="30px"
                        width="150px"
                    />
                )}
                <Select
                    label=""
                    width="90px"
                    options={selectOptions.monthOptions}
                    value={selectedMonth}
                    onChange={value => setSelectedMonth(value)}
                    placeholder="Moat wälen"
                    isDisabled={!selectedUser}
                />
            </div>
        </div>
    );
};

export default SiteHeaderContent;
