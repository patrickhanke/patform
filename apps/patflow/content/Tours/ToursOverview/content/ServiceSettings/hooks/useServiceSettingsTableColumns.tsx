import { StatelessToggle, TableColumnTextfield, Toggle } from '@repo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { Service } from '@types';
import React, { useMemo } from 'react'
import { UseServiceSettingsTableColumns } from '../types';

const useServiceSettingsTableColumns: UseServiceSettingsTableColumns= ({updateHandler}) => {
  const columns: ColumnDef<Service>[] = useMemo(() => [
      {
        accessorKey: 'name',
        header: () => <span>Name</span>,
        if: 'name',
        cell: info => info.getValue(),
        footer: info => info.column.id,
        sortingFn: 'alphanumeric'
      },
      {
        accessorFn: (row) => (
        <TableColumnTextfield 
            value={row.description} 
            isEditable={true} 
            onChange={(value) => updateHandler({serviceId: row.objectId, updateObject: {description: value}})} 
            />
        ),
        header: () => <span>Beschreibung</span>,
        id: 'description',
        cell: info => info.getValue(),
        footer: info => info.column.id,
        sortingFn: 'alphanumeric'
      },
      {
        accessorFn: (row) => (
          <StatelessToggle 
            value={row.is_active} 
            onChange={(value: boolean) => updateHandler({serviceId: row.objectId, updateObject: {is_active: value}})} 
          />
        ),
        header: () => <span>Aktiv</span>,
        id: 'is_active',
        cell: info => info.getValue(),
        footer: info => info.column.id,
        sortingFn: 'alphanumeric'
      }
    ], []);

  return columns;
}

export default useServiceSettingsTableColumns