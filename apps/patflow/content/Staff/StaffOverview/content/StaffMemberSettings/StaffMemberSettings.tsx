import { IconButton, SlideIn } from '@repo/ui';
import React, { useState } from 'react';
import NotificationSettings from './components/NotificationSettings';

const StaffMemberSettings = ({ userId }: { userId: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                icon="edit"
                onClick={() => setOpen(!open)}
            />
            <SlideIn
                header="Mitarbeiter Einstellungen"
                isOpen={open}
                cancel={() => setOpen(false)}
                confirm={() => setOpen(false)}
            >
                <div>
                    <NotificationSettings userId={userId} />
                </div>
            </SlideIn>
        </>
    );
};

export default StaffMemberSettings;
