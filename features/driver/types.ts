export type DriverId = string;

export type Driver = {
  id: DriverId;
  name: string;
  status: number;
  currentCompanyId: string | null;
  createdAt: string;
};

export type DriverRegistrationInput = {
  lineUserId: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  email?: string;
  selfReportedCompanyName: string;
  selfReportedVehicleNo: string;
};
