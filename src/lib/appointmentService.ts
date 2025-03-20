
import { Appointment } from "./types";
import { getData, saveData } from "./storage";
import { updateStylistSchedule } from "./scheduleService";

// Get all appointments
export function getAppointments(): Appointment[] {
  const data = getData();
  return data.appointments || [];
}

// Book appointment
export function bookAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
  const data = getData();
  
  // Create new appointment with ID
  const newId = Math.max(0, ...data.appointments.map((a: Appointment) => a.id)) + 1;
  const newAppointment = {
    ...appointment,
    id: newId,
    status: "Pending" as const
  };
  
  // Add to appointments
  data.appointments.push(newAppointment);
  
  // Update stylist's schedule
  updateStylistSchedule(
    appointment.stylistId,
    appointment.date,
    appointment.time,
    { 
      clientName: appointment.client, 
      service: appointment.service 
    }
  );
  
  // Save data
  saveData(data);
  
  return newAppointment;
}

// Update appointment status
export function updateAppointmentStatus(id: number, status: "Confirmed" | "Pending" | "Cancelled"): Appointment | null {
  const data = getData();
  
  let updatedAppointment = null;
  
  data.appointments = data.appointments.map((appointment: Appointment) => {
    if (appointment.id === id) {
      updatedAppointment = { ...appointment, status };
      return updatedAppointment;
    }
    return appointment;
  });
  
  saveData(data);
  
  return updatedAppointment;
}

// Auto-update appointment statuses (e.g., confirm pending appointments within 24 hours)
export function autoUpdateAppointmentStatuses(): Appointment[] {
  const data = getData();
  
  let updated = false;
  
  const updatedAppointments = data.appointments.map((apt: Appointment) => {
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
