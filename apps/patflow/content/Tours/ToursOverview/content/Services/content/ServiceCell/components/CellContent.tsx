import { StateDisplay } from '@repo/ui';
import React, { FC, useCallback, useMemo } from 'react';
import { CellContentProps } from '../types';

const CellContent: FC<CellContentProps> = ({
    service,
    setAddEditService,
    serviceId,
    serviceName,
    propertyId,
    propertyName,
}) => {
    const setEditService = useCallback(() => {
        setAddEditService({
            ...service,
            serviceId,
            serviceName,
            propertyId,
            propertyName,
        });
    }, [service, serviceId, serviceName, propertyId, propertyName]);

    const getUnit = (unit: string) => {
        const units = [
            {
                value: 'weeks',
                label: 'Wochen',
            },
            {
                value: 'months',
                label: 'Monate',
            },
        ];
        const unitLabel = units.find(un => un.value === unit);
        return unitLabel?.label;
    };

    const renderService = useMemo(() => {
        if (service.type === 'interval') {
            return (
                <div>
                    <StateDisplay
                        label={`${service.interval.number} ${getUnit(service.interval.unit)}`}
                        color="green"
                        icon="clock"
                        onClick={() => setEditService()}
                    />
                </div>
            );
        } else if (service.type === 'dates') {
            return (
                <div>
                    <StateDisplay
                        label={`${service.dates.length} Tage`}
                        color="blue"
                        icon="calendar"
                        onClick={() => setEditService()}
                    />
                </div>
            );
        }
    }, [service]);

    return <div className="button_container">{renderService}</div>;
};

export default CellContent;
