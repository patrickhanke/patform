import React, { FC, useState } from 'react'
import { ServiceCellProps } from './types';
import AddService from './content/AddService';

const ServiceCell: FC<ServiceCellProps> = ({services, id, serviceName, propertyId, refetch}) => {
    const [addService, setAddService] = useState(false);
    const service = services[id];
    console.log({services});
    console.log({service});

    if (!service) return( 
        <div>
            <button onClick={() => setAddService(true)}>+</button>
            {addService &&
                <AddService 
                    title={`${services.name} - ${serviceName}`} 
                    addService={addService} 
                    setAddService={setAddService} 
                    propertyId={propertyId} 
                    serviceId={id}
                    refetch={refetch}
                />
            }
        </div>
    );
    
  return (
    <div>

    </div>
  )
}

export default ServiceCell