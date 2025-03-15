import { useDataHandler } from '@repo/provider';
import { Modal } from '@repo/ui';
import React, { FC, useCallback, useState } from 'react';
import { ArchivePropertyProps } from '../types';

const ArchiveProperty: FC<ArchivePropertyProps> = ({
    propertyId,
    refetch,
    isArchived,
}) => {
    const { updateData } = useDataHandler();
    const [archiveModal, setArchiveModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const archiveProperty = useCallback(async () => {
        setLoading(true);
        await updateData({
            className: 'Property',
            objectId: propertyId,
            updateObject: {
                archived: isArchived ? false : true,
            },
            onError: () => {
                console.log('error');
            },
        });
        setLoading(false);
        setArchiveModal(false);
        refetch();
    }, [propertyId, isArchived]);

    return (
        <div>
            <button
                className="full_button grey"
                onClick={() => setArchiveModal(true)}
            >
                {isArchived ? 'Archivierung aufheben' : 'Objekt archivieren'}
            </button>
            {archiveModal && (
                <Modal
                    isOpen={archiveModal}
                    confirmButtonHandler={archiveProperty}
                    cancelButtonHandler={() => setArchiveModal(false)}
                    header="Objekt archivieren"
                    buttonDisabled={[loading, loading]}
                >
                    <p>
                        {isArchived
                            ? 'Sind Sie Sicher, dass sie diese Archivierung aufheben möchten?'
                            : 'Sind Sie Sicher, dass sie dieses Objekte archivieren möchten?'}
                    </p>
                </Modal>
            )}
        </div>
    );
};

export default ArchiveProperty;
