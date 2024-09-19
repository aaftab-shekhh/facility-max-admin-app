export const arrayToString = (arr: string[]) => {
  return arr?.length ? arr.filter((el: string) => el !== null).join(', ') : '';
};
