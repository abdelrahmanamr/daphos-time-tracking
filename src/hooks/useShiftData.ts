import { useCallback, useEffect, useState } from "react";
import type { Shift } from "../types";
import { api } from "../services/api";

export interface UseShiftDataProps {
  shifts: Shift[];
  loading: boolean;
  refetch: () => void;
}
export const useShiftData = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const shiftsData = await api.getShifts();
      setShifts(shiftsData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  return { shifts, loading, refetch: fetchShifts };
};
