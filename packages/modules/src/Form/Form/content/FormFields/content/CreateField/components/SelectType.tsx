import React, { FC, useMemo } from 'react'
import { ElementSelectInterface } from '@repo/ui';
import select_types from '../constants/select_types';
import { SelectTypeProps } from '../types';

const SelectType: FC<SelectTypeProps> = ({type, setType}) => {
  return (
        <ElementSelectInterface
            title='Feldtyp auswählen'
            elements={select_types}
            selectedElements={type ? [select_types.find((el) => el.value === type)] : []}
            onSelect={(values) => {
                if (values.length > 0) {
                    setType(values[0].value)
                } 
            }}
            max={1}
        />
  )
}

export default SelectType