import { useQuery } from '@apollo/client'
import { AppContext, generateGraphQLQuery } from '@provider'
import { WorkerSelectWithState, WorkersInterface } from 'content/_UI'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import Tour from './content/Tour'
import { ToursProps } from './types'
import { differenceInCalendarISOWeeks, differenceInCalendarISOWeekYears, getWeek } from 'date-fns'
import { Select } from '@repo/ui'
import { SelectOption } from '@repo/types'

const Tours: FC<ToursProps> = ({projectId, setPageHeaderContent}) => {
    const {year} = useContext(AppContext)

    const [worker, setWorker] = useState<string | null>(null);

    const weekOptions: SelectOption[] = useMemo(() => {
        const weeks = differenceInCalendarISOWeeks(new Date(year, 11, 31), new Date(year, 0, 1));
        const weekOptions = [];
        for (let i = 0; i < weeks; i++) {
            weekOptions.push({label: `KW ${i + 1}`, value: i + 1});
        }
        return weekOptions;
    }, [year])

    const [week, setWeek] = React.useState<SelectOption>(weekOptions.find(option => option.value === getWeek(new Date())) as SelectOption);
    console.log(week);
    console.log(worker);

    const pageHeaderContent = useMemo(() => {
        console.log({worker});
        
        return (
            <div className='button_container'>
                <Select
                    value={week}
                    onChange={(value) => setWeek(value)}
                    options={weekOptions}
                />
                <WorkerSelectWithState
                    setSelectedWorkers={(worker) => setWorker(worker.value) }
                    selectedWorkers={worker}
                    isMulti={false}
                />
            </div>
    )}, [week, worker])

    useEffect(() => {
        console.log('effect');
        
        setPageHeaderContent(pageHeaderContent)
    }, [week, worker])
    

    return (
        <div>
            {worker && <Tour projectId={projectId} workerId={worker} />}
        </div>
    )
}

export default Tours