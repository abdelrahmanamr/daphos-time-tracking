export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email?: string;
  phone?: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakHours: number;
  notes?: string;
}

export interface EmployeeStats {
  employeeId: string;
  totalShifts: number;
  totalShiftHours: number;
  totalWorkingHours: number;
  totalBreakHours: number;
  averageWorkLength: number;
}

export interface DashboardData {
  employee: Employee;
  stats: EmployeeStats;
  recentShifts: Shift[];
}
