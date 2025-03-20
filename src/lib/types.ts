
// Types for the salon data model
export interface TimeSlot {
  time: string;
  isBooked: boolean;
  clientName?: string;
  service?: string;
}

export interface StylistSchedule {
  date: string;
  slots: TimeSlot[];
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  dailyBookingLimit: number;
  workingHours: {
    start: string;
    end: string;
  };
  schedule: StylistSchedule[];
}

export interface Appointment {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  price: number;
  stylistId: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}
