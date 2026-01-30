import type { Shift } from "../types";
import dayjs from "dayjs";

export const calculateShiftHours = (
  startTime: string,
  endTime: string,
): number => {
  const baseDate = "2000-01-01";
  const start = dayjs(`${baseDate} ${startTime}`);
  let end = dayjs(`${baseDate} ${endTime}`);

  if (end.isBefore(start)) {
    end = end.add(1, "day"); // handle overnight shifts
  }

  return end.diff(start, "hour", true);
};

export const calculateEmployeeStats = (employeeId: string, shifts: Shift[]) => {
  const employeeShifts = shifts.filter(
    (shift) => shift.employeeId === employeeId,
  );

  const totalShifts = employeeShifts.length;

  const totalShiftHours = employeeShifts.reduce((total, shift) => {
    const hours = calculateShiftHours(shift.startTime, shift.endTime);
    return total + hours;
  }, 0);

  const totalBreakHours = employeeShifts.reduce((total, shift) => {
    return total + (shift.breakHours || 0);
  }, 0);

  const totalWorkingHours = totalShiftHours - totalBreakHours;

  const averageWorkLength =
    totalShifts > 0 ? totalWorkingHours / totalShifts : 0;

  return {
    employeeId,
    totalShifts,
    totalShiftHours,
    totalWorkingHours,
    totalBreakHours,
    averageWorkLength: parseFloat(averageWorkLength.toFixed(2)),
  };
};
