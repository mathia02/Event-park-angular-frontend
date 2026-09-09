import { ParkingSlotStatus } from '../enums/parking-slot-status.enum';

export interface ParkingSlotUpdate {
  slotNumber: string;
  zone: string;
  fee: number;
  status: ParkingSlotStatus;
}