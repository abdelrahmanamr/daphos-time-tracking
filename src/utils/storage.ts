import type { Employee, Shift } from "../types";

const STORAGE_KEYS = {
  EMPLOYEES: "daphos_employees",
  SHIFTS: "daphos_shifts",
};

export const storage = {
  // Employees
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  saveEmployees: (employees: Employee[]): void => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  // Shifts
  getShifts: (): Shift[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    return data ? JSON.parse(data) : [];
  },

  saveShifts: (shifts: Shift[]): void => {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  },

  // Clear all data (for testing)
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.SHIFTS);
  },
};
