import React, { FC } from 'react'
import { ServiceCellProps } from './types';
import { generateUuid } from '@repo/provider';
import CellContent from './components/CellContent';

const ServiceCell: FC<ServiceCellProps> = ({services, id, serviceName, propertyId, propertyName, setAddEditService}) => {
    const service = services[id];

    if (!service) return( 
        <div>
            <button 
                className='full_button light sm'
                onClick={() => setAddEditService({
                    id: generateUuid(),
                    days: [],
                    active: true,
                    type: 'interval',
                    dates: [],
                    interval: {
                        number: 1,
                        unit: 'weeks',
                        start_date: '',
                        end_date: ''
                    },
                    settings: {
                        continue: true,
                        repeat: false
                    },
                    serviceId: id,
                    serviceName,
                    propertyId,
                    propertyName
                })}
            >+ Hinzufügen</button>
        </div>
    );
    
  return (
    <CellContent 
        service={service} 
        setAddEditService={setAddEditService}  
        serviceId={id}
        serviceName={serviceName}
        propertyId={propertyId}
        propertyName={propertyName}
    />
  )
}

export default ServiceCell