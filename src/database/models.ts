export interface Vehicle {
  id: number;
  make: string;
  model: string;
  state: string;
}

export interface StateLog {
  id: number;
  vehicleId: number;
  state: string;
  timestamp: string;
}
