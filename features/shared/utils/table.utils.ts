import { Row, SortingFn } from "@tanstack/react-table";

export const caseInsensitiveSort: SortingFn<any> = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string
) => {
  const valueA = String(rowA.getValue(columnId)).toLowerCase();
  const valueB = String(rowB.getValue(columnId)).toLowerCase();
  return valueA.localeCompare(valueB);
};

export const dateAsStringSort: SortingFn<any> = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string
) => {
  const valueA = new Date(rowA.getValue(columnId));
  const valueB = new Date(rowB.getValue(columnId));
  if (valueA.getTime() < valueB.getTime()) {
    return -1;
  } else if (valueA.getTime() > valueB.getTime()) {
    return 1;
  } else {
    return 0;
  }
};
