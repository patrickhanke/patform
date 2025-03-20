import { Task } from "@repo/types";
import { getDayOfYear } from "date-fns";

const sortTasksForDivider = (array: Array<Task & { divider: boolean }>) => {
  const arrayCopy = [...array];

  const sortedArray = arrayCopy.sort((a, b) => {
    if (a.dates.length === 0) {
      return 1;
    }
    if (b.dates.length === 0) {
      return -1;
    }
    if (new Date(a.dates[0]).getTime() > new Date(b.dates[0]).getTime()) {
      return 1;
    }
    if (new Date(a.dates[0]).getTime() < new Date(b.dates[0]).getTime()) {
      return -1;
    }
    return 0;
  });

  for (let i = 0; i < sortedArray.length; i += 1) {
    if (i !== sortedArray.length - 1) {
      let newestDate;
      let nextDate;
      if (sortedArray[i].dates.length > 0) {
        newestDate = new Date(sortedArray[i].dates[0]);
      }

      if (sortedArray[i + 1].dates.length > 0) {
        nextDate = new Date(sortedArray[i + 1].dates[0]);
      }

      if (newestDate && nextDate === undefined) {
        const elementCopy = { ...sortedArray[i + 1] };
        elementCopy.divider = true;
        sortedArray[i + 1] = elementCopy;
      }

      if (
        newestDate &&
        nextDate &&
        getDayOfYear(newestDate) < getDayOfYear(nextDate)
      ) {
        const elementCopy = { ...sortedArray[i + 1] };
        elementCopy.divider = true;
        sortedArray[i + 1] = elementCopy;
      }
    }
  }

  return sortedArray;
};

export default sortTasksForDivider;
