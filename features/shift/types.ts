export type ShiftId = string;

export type Shift = {
  id: ShiftId;
  userId: string;
  scheduledDate: string;
  projectId: string;
  vehicleId: string | null;
  status: number;
};
