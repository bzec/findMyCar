export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ParkingValue {
  latitude: number;
  longitude: number;
  date: string;
  duration: string;
  name?: string;
  pictureData?: string;
}

export interface ParkingEntry {
  key: string;
  value: ParkingValue;
}

export interface AlertDelay {
  hours: number | null;
  minutes: number | null;
}
