
import { Service } from "./types";
import { getData } from "./storage";

// Get all services
export function getServices(): Service[] {
  const data = getData();
  return data.services || [];
}
