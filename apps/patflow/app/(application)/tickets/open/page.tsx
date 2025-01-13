import {Tickets} from '@content';
import { Suspense } from 'react';

const TicketsPage = () => {
    return (
        <Suspense>
            <Tickets pageState='open' />
        </Suspense>
    );
};

export default TicketsPage