
import { Stylist } from "./types";
import { getData } from "./storage";

// Get all stylists
export function getStylists(): Stylist[] {
  const data = getData();
  return data.stylists || [];
}
