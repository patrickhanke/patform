import { ElementSelectInterface } from '@repo/ui'
import React, { FC } from 'react'
import day_elements from '../constants/day_elements'
import { ServiceDaySelectProps } from '../types'

const ServiceDaySelect: FC<ServiceDaySelectProps> = ({day, onChange}) => {

  return (
    <ElementSelectInterface 
        title='Tag auswählen'
        elements={day_elements}
        onSelect={(elements) => onChange(elements)}
        max={1}
        selectedElements={[day]}
    />
  )
}

export default ServiceDaySelect