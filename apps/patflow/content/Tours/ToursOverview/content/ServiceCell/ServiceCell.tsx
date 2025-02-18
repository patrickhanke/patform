import { PropertyService, Service } from '@types'
import React, { FC } from 'react'
import { ServiceCellProps } from './types';

const ServiceCell: FC<ServiceCellProps> = ({services, id}) => {

    const service = services[id];
    if (!service) return( 
        <div>
            <button>+</button>
        </div>
    );
    
  return (
    <div>ServiceCell</div>
  )
}

export default ServiceCell