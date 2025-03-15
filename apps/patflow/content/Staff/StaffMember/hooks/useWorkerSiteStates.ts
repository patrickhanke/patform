import { useMemo } from 'react';

const useWorkerSiteStates = () => {
    const siteStates = useMemo(() => {
        const siteStateArray = [
            {
                value: 'overview',
                label: 'Überblick',
            },
            {
                value: 'times',
                label: 'Zeiterfassung',
            },
            {
                value: 'settings',
                label: 'Einstellungen',
            },
        ];

        return siteStateArray;
    }, []);

    return siteStates;
};

export default useWorkerSiteStates;
