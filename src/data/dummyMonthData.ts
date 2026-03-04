export type DayCategory = "current" | "futureOrUncompleted" | "completed" | "outsideMonth";
export interface CalendarDay {
  label: string;
  category: DayCategory;
}

export const JANUARY_2025: CalendarDay[] = [
  { label: "28", category: "outsideMonth" as DayCategory },
  { label: "29", category: "outsideMonth" as DayCategory },
  { label: "30", category: "outsideMonth" as DayCategory },
  { label: "31", category: "outsideMonth" as DayCategory },
  { label: "1", category: "completed" as DayCategory },
  { label: "2", category: "completed" as DayCategory },
  { label: "3", category: "completed" as DayCategory },
  { label: "4", category: "completed" as DayCategory },
  { label: "5", category: "current" as DayCategory },
  { label: "6", category: "futureOrUncompleted" as DayCategory },
  { label: "7", category: "futureOrUncompleted" as DayCategory },
  { label: "8", category: "futureOrUncompleted" as DayCategory },
  { label: "9", category: "futureOrUncompleted" as DayCategory },
  { label: "10", category: "futureOrUncompleted" as DayCategory },
  { label: "11", category: "futureOrUncompleted" as DayCategory },
  { label: "12", category: "futureOrUncompleted" as DayCategory },
  { label: "13", category: "futureOrUncompleted" as DayCategory },
  { label: "14", category: "futureOrUncompleted" as DayCategory },
  { label: "15", category: "futureOrUncompleted" as DayCategory },
  { label: "16", category: "futureOrUncompleted" as DayCategory },
  { label: "17", category: "futureOrUncompleted" as DayCategory },
  { label: "18", category: "futureOrUncompleted" as DayCategory },
  { label: "19", category: "futureOrUncompleted" as DayCategory },
  { label: "20", category: "futureOrUncompleted" as DayCategory },
  { label: "21", category: "futureOrUncompleted" as DayCategory },
  { label: "22", category: "futureOrUncompleted" as DayCategory },
  { label: "23", category: "futureOrUncompleted" as DayCategory },
  { label: "24", category: "futureOrUncompleted" as DayCategory },
  { label: "25", category: "futureOrUncompleted" as DayCategory },
  { label: "26", category: "futureOrUncompleted" as DayCategory },
  { label: "27", category: "futureOrUncompleted" as DayCategory },
  { label: "28", category: "futureOrUncompleted" as DayCategory },
  { label: "1", category: "outsideMonth" as DayCategory },
  { label: "2", category: "outsideMonth" as DayCategory },
  { label: "3", category: "outsideMonth" as DayCategory },
];
