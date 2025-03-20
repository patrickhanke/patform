const sortArrayHandler = <Type extends Array<any>>(
  array: Type,
  key: keyof Type[number],
): Type =>
  array.sort((n1, n2) => {
    if (n1[key] > n2[key]) {
      return 1;
    }

    if (n1[key] < n2[key]) {
      return -1;
    }

    return 0;
  });

export default sortArrayHandler;
