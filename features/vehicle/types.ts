export type VehicleId = string;

export type Vehicle = {
  id: VehicleId;
  plateNumber: string;
  name: string | null;
  ownershipType: number;
  isActive: number;
};
