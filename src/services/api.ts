import type { Employee, Shift } from "../types";
import { storage } from "../utils/storage";
import { calculateEmployeeStats } from "../utils/calculations";

export const api = {
  // Employee endpoints
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay
    return storage.getEmployees();
  },

  createEmployee: async (
    employee: Omit<Employee, "id" | "createdAt">,
  ): Promise<Employee> => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const employees = storage.getEmployees();
    employees.push(newEmployee);
    storage.saveEmployees(employees);

    return newEmployee;
  },

  updateEmployee: async (
    id: string,
    updates: Partial<Employee>,
  ): Promise<Employee> => {
    const employees = storage.getEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) throw new Error("Employee not found");

    employees[index] = { ...employees[index], ...updates };
    storage.saveEmployees(employees);

    return employees[index];
  },

  // Shift endpoints
  getShifts: async (employeeId?: string): Promise<Shift[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const shifts = storage.getShifts();

    if (employeeId) {
      return shifts.filter((shift) => shift.employeeId === employeeId);
    }

    return shifts;
  },

  createShift: async (shift: Omit<Shift, "id">): Promise<Shift> => {
    const newShift: Shift = {
      ...shift,
      id: Date.now().toString(),
    };

    const shifts = storage.getShifts();
    shifts.push(newShift);
    storage.saveShifts(shifts);

    return newShift;
  },

  updateShift: async (id: string, updates: Partial<Shift>): Promise<Shift> => {
    const shifts = storage.getShifts();
    const index = shifts.findIndex((s) => s.id === id);

    if (index === -1) throw new Error("Shift not found");

    shifts[index] = { ...shifts[index], ...updates };
    storage.saveShifts(shifts);

    return shifts[index];
  },

  deleteShift: async (id: string): Promise<void> => {
    const shifts = storage.getShifts();
    const filteredShifts = shifts.filter((s) => s.id !== id);
    storage.saveShifts(filteredShifts);
  },

  // Dashboard endpoints
  getEmployeeDashboard: async (employeeId: string) => {
    const employees = await api.getEmployees();
    const shifts = await api.getShifts(employeeId);

    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) throw new Error("Employee not found");

    const stats = calculateEmployeeStats(employeeId, shifts);

    return {
      employee,
      stats,
      recentShifts: shifts.slice(0, 5), // Last 5 shifts
    };
  },
};
