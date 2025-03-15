import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Absence, StaffMember } from '@types';
import { AppContext } from '@provider';
import { generateGraphQLQuery } from '@repo/provider';
import { Select } from '@content';
import { RecordAbsenceProps } from './types';
import styles from './RecordsAbsence.module.scss';
import { useQuery } from '@apollo/client';
import { FIND_ALL_STAFF } from '@queries';
import useRecordAbsenceColumns from './hooks/useRecordAbsenceColumns';
import EditRecordAbsence from './content/EditRecordAbsence';
import { Divider, Table } from '@repo/ui';

const RecordAbsence = ({
    records,
    editAbsence,
    setEditAbsence,
}: RecordAbsenceProps) => {
    const { year } = useContext(AppContext);
    const { data: staffData } = useQuery(FIND_ALL_STAFF);
    const [selectedStaff, setSelectedStaff] = useState<{
        value: string;
        label: string;
    } | null>(null);

    const siteHeaderContent = useMemo(() => {
        let staffOptions = [] as { value: string; label: string }[];
        if (staffData) {
            staffOptions = staffData.objects.find_User.results.map(
                (staff: StaffMember) => ({
                    value: staff.objectId,
                    label: `${staff.first_name} ${staff.family_name}`,
                })
            );
        }

        return (
            <div className={styles.siteheader_content}>
                <Select
                    label=""
                    width="150px"
                    options={staffOptions}
                    value={selectedStaff}
                    onChange={value => setSelectedStaff(value)}
                    placeholder="Mitarbeiter..."
                    isClearable
                />
            </div>
        );
    }, [year, staffData, selectedStaff]);

    const { data, refetch } = useQuery(
        generateGraphQLQuery({
            type: 'find',
            objectName: 'Absence',
            fields: [
                'objectId',
                'start_date',
                'end_date',
                'state',
                'user{objectId first_name family_name portrait}',
                'comment',
                'type',
                'year',
            ],
        }),
        {
            variables: { params: { year: { _eq: year } } },
            skip: !year,
        }
    );

    const absenceData = useMemo(() => {
        const absenceArray: Absence[] = [];
        if (data) {
            data.objects.findAbsence.results.forEach((absence: Absence) => {
                absenceArray.push({
                    ...absence,
                });
            });
        }

        return absenceArray;
    }, [selectedStaff, data]);

    const columns = useRecordAbsenceColumns({ refetch });

    useEffect(() => {
        if (year) {
            refetch();
        }
    }, [year]);

    return (
        <>
            <div>
                {absenceData.length > 0 && (
                    <>
                        {siteHeaderContent}
                        <Divider
                            size="small"
                            showLine={false}
                        />
                        <div className="content_element no_padding">
                            <Table
                                columns={columns}
                                data={absenceData}
                            />
                        </div>
                    </>
                )}
            </div>
            {records && (
                <EditRecordAbsence
                    refetch={refetch}
                    type="create"
                    editAbsence={editAbsence}
                    setEditAbsence={setEditAbsence}
                />
            )}
        </>
    );
};

export default RecordAbsence;
