import { Tickets } from '@content';
import { Suspense } from 'react';

const TicketsPage = () => {
    return (
        <Suspense>
            <Tickets pageState="in_progress" />
        </Suspense>
    );
};

export default TicketsPage;
