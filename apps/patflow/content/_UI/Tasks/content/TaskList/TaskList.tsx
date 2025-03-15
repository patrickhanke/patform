'use client';

import React, { useCallback, useState } from 'react';

import { useDataHandler } from '@repo/provider';
import { TaskListComponent } from './types';
import useTableColumns from './hooks/useTableColumns';
import { Task } from '@types';
import { Modal, Table } from '@repo/ui';

const TaskList = ({ taskList, refetch, pageState }: TaskListComponent) => {
    const { updateData, deleteData } = useDataHandler();
    const [deleteTaskModal, setDeleteTaskModal] = useState<undefined | Task>(
        undefined
    );
    const [archiveModal, setArchiveModal] = useState<undefined | Task>(
        undefined
    );

    const deleteTask = useCallback(async () => {
        if (deleteTaskModal) {
            await deleteData({
                className: 'Task',
                objectId: deleteTaskModal.objectId,
            });
        }
        refetch();
        setDeleteTaskModal(undefined);
    }, [deleteTaskModal]);

    const archiveTaskHandler = useCallback(async () => {
        if (archiveModal?.objectId) {
            await updateData({
                className: 'Task',
                objectId: archiveModal.objectId,
                updateObject: {
                    state: 'archived',
                },
            });
        }
        setArchiveModal(undefined);
        refetch();
    }, [archiveModal]);

    const columns = useTableColumns({
        refetch,
        setArchiveModal,
        setDeleteTaskModal,
        pageState,
    });

    return (
        <>
            <div>
                <Table
                    data={taskList}
                    columns={columns}
                />
                <Modal
                    isOpen={!!deleteTaskModal}
                    header="Aufgabe löschen"
                    confirmButtonHandler={() => deleteTask()}
                    cancelButtonHandler={() => setDeleteTaskModal(undefined)}
                >
                    <p>
                        Sie Sie sicher, dass sie die Aufgabe{' '}
                        <span style={{ fontWeight: 600 }}>
                            {deleteTaskModal?.title}
                        </span>{' '}
                        löschen möchten? Dieser Vorgang lässt sich nicht
                        rückgängig machen.
                    </p>
                </Modal>
                <Modal
                    isOpen={!!archiveModal}
                    header="Aufgabe löschen"
                    confirmButtonHandler={() => archiveTaskHandler()}
                    cancelButtonHandler={() => setArchiveModal(undefined)}
                >
                    <p>
                        Sie Sie sicher, dass sie die Aufgabe{' '}
                        <span style={{ fontWeight: 600 }}>
                            {archiveModal?.title}
                        </span>{' '}
                        archivieren möchten?
                    </p>
                </Modal>
            </div>
        </>
    );
};

export default TaskList;
