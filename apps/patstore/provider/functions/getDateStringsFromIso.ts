import getDateFromIso from "./getDateFromIso.ts";

export const getDateStringsFromIso = (datum: string | undefined) => {
  if (!datum) return { date: "", time: "", dateTime: "" };
  const newdatum = getDateFromIso(datum);
  const date = new Date(newdatum);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}`,
    dateTime: `${day}.${month}.${year} ${hours}:${minutes}`,
  };
};

export default getDateStringsFromIso;
