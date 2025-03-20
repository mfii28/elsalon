
// Re-export types
export * from './types';

// Re-export functions from storage service
import { initializeLocalStorage } from './storage';

// Re-export functions from schedule service
import {
  generateInitialSchedule,
  checkStylistAvailability,
  updateStylistSchedule
} from './scheduleService';

// Re-export functions from stylist service
import { getStylists } from './stylistService';

// Re-export functions from appointment service
import {
  getAppointments,
  bookAppointment,
  updateAppointmentStatus,
  autoUpdateAppointmentStatuses
} from './appointmentService';

// Re-export functions from services service
import { getServices } from './servicesService';

// Initialize on load
initializeLocalStorage();

// Export all functions as default object for compatibility with existing code
export default {
  getStylists,
  getAppointments,
  getServices,
  bookAppointment,
  updateAppointmentStatus,
  checkStylistAvailability,
  updateStylistSchedule,
  autoUpdateAppointmentStatuses,
  generateInitialSchedule
};
