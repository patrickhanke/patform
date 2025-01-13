import { find_record } from '@queries';
import { Record } from '@types';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

type Props = {
    year: number,
    userId: string
}

type ReturnObject = {
    record: Record | null,
    loading: boolean
}

const useGetActiveRecord: {(T: Props): ReturnObject} = ({year, userId}) => {
	const {data: recordData, loading} = useQuery(find_record, {
		variables: {params: {year: {_eq: year}, user: {_eq: userId}}}
	});
    
	const data: ReturnObject = useMemo(() => ({
		record: recordData?.objects.findRecord.results[0] || null,
		loading
	}), [recordData, loading]);

	return data;
};

export default useGetActiveRecord;