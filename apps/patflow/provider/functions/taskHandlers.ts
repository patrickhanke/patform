export const findTaskRoute = (task_state: string) => {
    switch (task_state) {
        case 'created':
            return '/tasks/active';
        case 'assigned':
            return '/tasks/active';
        case 'executed':
            return '/tasks/active';
        case 'completed':
            return '/tasks/completed';
        case 'archived':
            return '/tasks/archived';
        default:
            return '/tasks';
    }
};
