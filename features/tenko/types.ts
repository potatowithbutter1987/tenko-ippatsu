export type DailyReportId = string;

export type DailyReport = {
  id: DailyReportId;
  userId: string;
  targetDate: string;
  isAlert: number;
};
