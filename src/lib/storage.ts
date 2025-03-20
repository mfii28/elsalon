
import dbData from "../data/db.json";
import { generateInitialSchedule } from "./scheduleService";

// Initialize local storage with data if it doesn't exist
export function initializeLocalStorage() {
  if (!localStorage.getItem('salon-data')) {
    // Use the pre-configured schedules from db.json
    localStorage.setItem('salon-data', JSON.stringify(dbData));
  }
}

// Get data from local storage
export function getData() {
  initializeLocalStorage();
  const data = JSON.parse(localStorage.getItem('salon-data') || '{}');
  return data;
}

// Save data to local storage
export function saveData(data: any) {
  localStorage.setItem('salon-data', JSON.stringify(data));
}
