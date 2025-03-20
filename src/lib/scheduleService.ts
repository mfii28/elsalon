
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { StylistSchedule, TimeSlot } from "./types";
import { getData, saveData } from "./storage";

// Generate initial schedule (30 days) for stylists if needed
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

// Check stylist availability
export function checkStylistAvailability(
  stylistId: string,
  date: string,
  time: string
): boolean {
  const data = getData();
  const stylist = data.stylists.find((s: any) => s.id === stylistId);
  
  if (!stylist) return false;

  const daySchedule = stylist.schedule.find((s: any) => s.date === date);
  if (!daySchedule) return false;

  // Check if stylist has reached daily booking limit
  const dailyBookings = daySchedule.slots.filter((slot: TimeSlot) => slot.isBooked).length;
  if (dailyBookings >= stylist.dailyBookingLimit) return false;

  // Check specific time slot availability
  const timeSlot = daySchedule.slots.find((slot: TimeSlot) => slot.time === time);
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
  
  data.stylists = data.stylists.map((stylist: any) => {
    if (stylist.id !== stylistId) return stylist;

    const updatedSchedule = stylist.schedule.map((day: any) => {
      if (day.date !== date) return day;

      const updatedSlots = day.slots.map((slot: TimeSlot) => {
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
