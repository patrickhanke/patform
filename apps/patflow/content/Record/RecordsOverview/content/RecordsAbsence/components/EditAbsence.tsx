import React, { useState } from 'react';
import { EditAbsenceProps } from '../types';
import DeleteAbsence from './DeleteAbsence';
import EditRecordAbsence from '../content/EditRecordAbsence';
import { IconButton } from '@repo/ui';

const EditAbsence = ({ absence, refetch }: EditAbsenceProps) => {
    const [deleteAbsence, setDeleteAbsence] = useState(false);
    const [editAbsence, setEditAbsence] = useState(false);

    return (
        <>
            <div className="button_container">
                <IconButton
                    icon="delete"
                    onClick={() => {
                        setDeleteAbsence(true);
                    }}
                />
                <IconButton
                    icon="edit"
                    onClick={() => {
                        setEditAbsence(true);
                    }}
                />
            </div>
            {deleteAbsence && (
                <DeleteAbsence
                    deleteAbsence={deleteAbsence}
                    setDeleteAbsence={setDeleteAbsence}
                    absence={absence}
                    refetch={refetch}
                />
            )}
            {editAbsence && (
                <EditRecordAbsence
                    editAbsence={editAbsence}
                    type="edit"
                    setEditAbsence={setEditAbsence}
                    absence={absence}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default EditAbsence;
