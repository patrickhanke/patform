import { getDateFromIso } from "@repo/provider";
import { TallyTypes } from "@repo/types";
import { isArray } from "lodash-es";

function getLastEntry(
  entries: TallyTypes.Entry[] | undefined,
): TallyTypes.Entry | undefined {
  if (isArray(entries) && entries?.length > 0) {
    const sortedEntries = [...entries].sort(
      (a, b) =>
        getDateFromIso(b.date).getTime() - getDateFromIso(a.date).getTime(),
    );
    return sortedEntries[0];
  }
  return undefined;
}

export default getLastEntry;
