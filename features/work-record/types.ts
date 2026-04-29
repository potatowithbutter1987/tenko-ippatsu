export type WorkRecordId = string;

export type WorkRecord = {
  id: WorkRecordId;
  userId: string;
  shiftId: string;
  targetDate: string;
  projectId: string;
};
