
import { addDays, format, isSameDay, parseISO } from "date-fns";
import dbData from "../data/db.json";

// Types
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

// Init local storage with data if it doesn't exist
function initializeLocalStorage() {
  if (!localStorage.getItem('salon-data')) {
    // Generate schedules for stylists before saving
    const stylists = dbData.stylists.map(stylist => ({
      ...stylist,
      schedule: generateInitialSchedule()
    }));

    const initialData = {
      ...dbData,
      stylists
    };

    localStorage.setItem('salon-data', JSON.stringify(initialData));
  }
}

// Get data from local storage
function getData(): {
  stylists: Stylist[];
  appointments: Appointment[];
  services: Service[];
} {
  initializeLocalStorage();
  const data = JSON.parse(localStorage.getItem('salon-data') || '{}');
  return data;
}

// Save data to local storage
function saveData(data: any) {
  localStorage.setItem('salon-data', JSON.stringify(data));
}

// Generate initial schedule (30 days) for stylists
export function generateInitialSchedule(): StylistSchedule[] {
  const TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  ];
  
  const schedule: StylistSchedule[] = [];
  const today = new Date();
  
  // Generate schedule for next 30 days
  for (let i = 0; i < 30; i++) {
    const currentDate = addDays(today, i);
    schedule.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      slots: TIME_SLOTS.map(time => ({
        time,
        isBooked: false
      }))
    });
  }
  
  return schedule;
}

// Get all stylists
export function getStylists(): Stylist[] {
  const data = getData();
  return data.stylists || [];
}

// Get all appointments
export function getAppointments(): Appointment[] {
  const data = getData();
  return data.appointments || [];
}

// Get all services
export function getServices(): Service[] {
  const data = getData();
  return data.services || [];
}

// Book appointment
export function bookAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
  const data = getData();
  
  // Create new appointment with ID
  const newId = Math.max(0, ...data.appointments.map(a => a.id)) + 1;
  const newAppointment = {
    ...appointment,
    id: newId,
    status: "Pending" as const
  };
  
  // Add to appointments
  data.appointments.push(newAppointment);
  
  // Update stylist's schedule
  data.stylists = data.stylists.map(stylist => {
    if (stylist.id === appointment.stylistId) {
      stylist.schedule = stylist.schedule.map(day => {
        if (day.date === appointment.date) {
          day.slots = day.slots.map(slot => {
            if (slot.time === appointment.time) {
              return {
                ...slot,
                isBooked: true,
                clientName: appointment.client,
                service: appointment.service
              };
            }
            return slot;
          });
        }
        return day;
      });
    }
    return stylist;
  });
  
  // Save data
  saveData(data);
  
  return newAppointment;
}

// Update appointment status
export function updateAppointmentStatus(id: number, status: "Confirmed" | "Pending" | "Cancelled"): Appointment | null {
  const data = getData();
  
  let updatedAppointment = null;
  
  data.appointments = data.appointments.map(appointment => {
    if (appointment.id === id) {
      updatedAppointment = { ...appointment, status };
      return updatedAppointment;
    }
    return appointment;
  });
  
  saveData(data);
  
  return updatedAppointment;
}

// Check stylist availability
export function checkStylistAvailability(
  stylistId: string,
  date: string,
  time: string
): boolean {
  const data = getData();
  const stylist = data.stylists.find(s => s.id === stylistId);
  
  if (!stylist) return false;

  const daySchedule = stylist.schedule.find(s => s.date === date);
  if (!daySchedule) return false;

  // Check if stylist has reached daily booking limit
  const dailyBookings = daySchedule.slots.filter(slot => slot.isBooked).length;
  if (dailyBookings >= stylist.dailyBookingLimit) return false;

  // Check specific time slot availability
  const timeSlot = daySchedule.slots.find(slot => slot.time === time);
  return timeSlot ? !timeSlot.isBooked : false;
}

// Update stylist schedule
export function updateStylistSchedule(
  stylistId: string,
  date: string,
  time: string,
  booking: { clientName: string; service: string; }
): boolean {
  const data = getData();
  
  let updated = false;
  
  data.stylists = data.stylists.map(stylist => {
    if (stylist.id !== stylistId) return stylist;

    const updatedSchedule = stylist.schedule.map(day => {
      if (day.date !== date) return day;

      const updatedSlots = day.slots.map(slot => {
        if (slot.time !== time) return slot;
        updated = true;
        return {
          ...slot,
          isBooked: true,
          clientName: booking.clientName,
          service: booking.service
        };
      });

      return { ...day, slots: updatedSlots };
    });

    return { ...stylist, schedule: updatedSchedule };
  });
  
  if (updated) {
    saveData(data);
  }
  
  return updated;
}

// Auto-update appointment statuses (e.g., confirm pending appointments within 24 hours)
export function autoUpdateAppointmentStatuses(): Appointment[] {
  const data = getData();
  
  let updated = false;
  
  const updatedAppointments = data.appointments.map(apt => {
    const appointmentDate = new Date(`${apt.date} ${apt.time}`);
    const now = new Date();
    
    // Automatically confirm appointments 24h before
    if (appointmentDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000 
        && apt.status === "Pending") {
      updated = true;
      return { ...apt, status: "Confirmed" as const };
    }
    
    return apt;
  });
  
  if (updated) {
    data.appointments = updatedAppointments;
    saveData(data);
  }
  
  return updatedAppointments;
}

// Initialize on load
initializeLocalStorage();

export default {
  getStylists,
  getAppointments,
  getServices,
  bookAppointment,
  updateAppointmentStatus,
  checkStylistAvailability,
  updateStylistSchedule,
  autoUpdateAppointmentStatuses
};
