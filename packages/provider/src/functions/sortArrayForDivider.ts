type Key = "createdAt" | "updatedAt" | "date";

export const sortArrayForDivider = (array: Array<any>, key: Key) => {
  const arrayCopy = [...array];
  for (let i = 0; i < arrayCopy.length; i += 1) {
    if (i !== arrayCopy.length - 1) {
      const newestDate = new Date(array[i][key]);
      const nextDate = new Date(array[i + 1][key]);

      if (newestDate.getDate() > nextDate.getDate()) {
        const elementCopy = { ...arrayCopy[i + 1] };
        elementCopy.divider = true;
        arrayCopy.splice(i + 1, 1, elementCopy);
      }
    }
  }

  return arrayCopy;
};
