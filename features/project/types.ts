export type ProjectId = string;

export type Project = {
  id: ProjectId;
  name: string;
  type: number;
  pickupLocation: string;
  deliveryLocation: string;
  isActive: number;
};
