export type OperatingHoursStatus = "exceeded" | "warning" | "normal";

export type DriverOperatingHoursEntry = {
  id: string;
  driverName: string;
  affiliation: string;
  affiliationId: string;
  totalHours: number;
};

export type OperatingHoursStatusFilter = OperatingHoursStatus;

export type OperatingHoursFilterValue = {
  status: ReadonlyArray<OperatingHoursStatusFilter>;
  driverName: string;
  affiliationId: string;
  totalHoursMin: string;
  totalHoursMax: string;
  remainingHoursMin: string;
  remainingHoursMax: string;
};

export const LEGAL_LIMIT_HOURS = 284;
export const WARNING_THRESHOLD_HOURS = 275;

export const DEFAULT_OPERATING_HOURS_FILTER: OperatingHoursFilterValue = {
  status: [],
  driverName: "",
  affiliationId: "",
  totalHoursMin: "",
  totalHoursMax: "",
  remainingHoursMin: "",
  remainingHoursMax: "",
};

export const resolveOperatingHoursStatus = (
  totalHours: number,
): OperatingHoursStatus => {
  if (totalHours >= LEGAL_LIMIT_HOURS) return "exceeded";
  if (totalHours >= WARNING_THRESHOLD_HOURS) return "warning";
  return "normal";
};

export const calcRemainingHours = (totalHours: number): number =>
  LEGAL_LIMIT_HOURS - totalHours;

export const countActiveOperatingHoursFilters = (
  filter: OperatingHoursFilterValue,
): number => {
  let count = filter.status.length;
  if (filter.driverName.trim() !== "") count += 1;
  if (filter.affiliationId !== "") count += 1;
  if (filter.totalHoursMin !== "" || filter.totalHoursMax !== "") count += 1;
  if (filter.remainingHoursMin !== "" || filter.remainingHoursMax !== "") {
    count += 1;
  }
  return count;
};
