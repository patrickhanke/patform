import { IconButton, SlideIn } from '@repo/ui';
import React, { FC, useState } from 'react'
import { PropertySettingsProps } from './types';
import { generateGraphQLQuery } from '@repo/provider';
import { useQuery } from '@apollo/client';

const PropertySettings: FC<PropertySettingsProps> = ({propertyId}) => {
    const {data} = useQuery(generateGraphQLQuery({
        objectName: 'Property',
        type: 'get',
        fields: ['objectId', 'name', 'description']
    }), {
        variables: {
            id: propertyId
        }
    })

    console.log(data);
    
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <IconButton
                icon='settings'
                onClick={() => setIsOpen(true)}
            />
            {isOpen && 
            <SlideIn
                isOpen={isOpen}
                confirm={() =>  setIsOpen(false)}
                header='Einstellungen'
                cancel={() => setIsOpen(false)}
            >
                #

            </SlideIn>
            
            }
        </div>
    )
}

export default PropertySettings