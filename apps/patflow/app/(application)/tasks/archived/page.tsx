import { Tasks } from '@content';
import { Suspense } from 'react';

const TasksPage = () => (
    <Suspense>
        <Tasks pageState='archived' />
    </Suspense>
);

export default TasksPage;