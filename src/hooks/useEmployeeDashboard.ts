import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { DashboardData } from "../types";
import { notification } from "antd";
export interface UseEmployeeDashboard {
  dashboardData: DashboardData | null;
  loading: boolean;
  refetch: () => void;
}

export const useEmployeeDashboard = (employeeId?: string) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      const result = await api.getEmployeeDashboard(employeeId);
      setDashboardData(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      notification.error({
        title: "Failed to load dashboard data",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboardData, loading, refetch: fetchDashboard };
};
