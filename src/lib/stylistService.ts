
import { Stylist } from "./types";
import { getData, saveData } from "./storage";

// Get all stylists
export function getStylists(): Stylist[] {
  const data = getData();
  return data.stylists || [];
}

// Get a specific stylist by ID
export function getStylistById(id: string): Stylist | undefined {
  const stylists = getStylists();
  return stylists.find(stylist => stylist.id === id);
}

// Get available time slots for a specific stylist on a specific date
export function getAvailableTimeSlots(stylistId: string, date: string): { time: string; isBooked: boolean }[] {
  const stylist = getStylistById(stylistId);
  if (!stylist) return [];
  
  const daySchedule = stylist.schedule.find(day => day.date === date);
  if (!daySchedule) return [];
  
  return daySchedule.slots;
}

// Update stylist's available time slots when a booking is made
export function updateStylistAvailability(
  stylistId: string, 
  date: string, 
  time: string, 
  isBooked: boolean, 
  clientInfo?: { clientName: string; service: string }
): boolean {
  const data = getData();
  let updated = false;
  
  data.stylists = data.stylists.map((stylist: Stylist) => {
    if (stylist.id !== stylistId) return stylist;
    
    const updatedSchedule = stylist.schedule.map(day => {
      if (day.date !== date) return day;
      
      const updatedSlots = day.slots.map(slot => {
        if (slot.time !== time) return slot;
        
        updated = true;
        return {
          ...slot,
          isBooked,
          ...(clientInfo && { clientName: clientInfo.clientName, service: clientInfo.service })
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
