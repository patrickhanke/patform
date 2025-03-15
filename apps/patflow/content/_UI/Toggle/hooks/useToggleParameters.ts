import { GET_SERVICE_ACTIVE, GET_STAFF_ISWORKER } from '@queries';
import { ToggleType } from '../types';
import { DocumentNode } from '@apollo/client';

const useToggleParameters = (type: ToggleType) => {
    if (type === 'get_service_active') {
        return {
            className: 'Service',
            query: GET_SERVICE_ACTIVE,
            path: 'objects.getService.active',
            entry: 'active',
        };
    }
    if (type === 'is_worker') {
        return {
            className: '_User',
            query: GET_STAFF_ISWORKER,
            path: 'objects.get_User.is_worker',
            entry: 'is_worker',
        };
    }

    return {
        className: '',
        query: undefined as unknown as DocumentNode,
        path: '.objects.getService.active',
        entry: '',
    };
};

export default useToggleParameters;
