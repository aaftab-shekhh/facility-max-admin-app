export const sortedBy = (key: string, arr: any[], revers?: boolean) => {
  const copyArr = [...arr];

  if (copyArr) {
    return copyArr.sort((a, b) => {
      if (a[key] < b[key] && a[key] !== 'Other' && a[key] !== 'Other ') {
        return revers ? 1 : -1;
      }
      if (a[key] > b[key] && b[key] !== 'Other' && b[key] !== 'Other ') {
        return revers ? -1 : 1;
      }
      return 0;
    });
  }

  return [];
};
