import { useCallback, useEffect, useState } from "react";
import type { Employee } from "../types";
import { api } from "../services/api";
import { notification } from "antd";

export interface UseEmployeesDataProps {
  employees: Employee[];
  loading: boolean;
  refetch: () => void;
}
export const useEmployeesData = (): UseEmployeesDataProps => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      notification.error({
        message: "Failed to fetch employees",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, refetch: fetchEmployees };
};
