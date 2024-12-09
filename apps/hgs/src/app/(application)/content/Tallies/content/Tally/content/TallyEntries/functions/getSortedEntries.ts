import { getDateFromIso } from '@/provider';
import { TallyTypes } from '@/types';
import { isArray } from 'lodash';

function getSortedEntries(entries: TallyTypes.Entry[] | undefined): TallyTypes.Entry[]  | [] {
    if (isArray(entries) && entries?.length > 0) {
        const sortedEntries = [...entries].sort((a, b) => getDateFromIso(b.date).getTime() - getDateFromIso(a.date).getTime());
        return sortedEntries;
    }
    return [];
};

export default getSortedEntries;