import { useState, useEffect } from "react";
import { checkPointsAPI } from "@/lib/api/supabase/checkPointsAPI";
import { CheckPointType, ApiErrorType } from "@/lib/types";

export const useCheckPoints = (profileId?: string) => {
  const [checkPoints, setCheckPoints] = useState<CheckPointType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiErrorType | null>(null);

  useEffect(() => {
    const fetchCheckPoints = async () => {
      try {
        setLoading(true);
        let data;
        if (profileId) {
          data = await checkPointsAPI.getCheckPointsByProfileId(profileId);
        } else {
          data = await checkPointsAPI.getCheckPoints();
        }
        setCheckPoints(data);
      } catch (err) {
        console.error("Error fetching check points:", err);
        setError(err as ApiErrorType);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckPoints();
  }, []);

  return { checkPoints, setCheckPoints, loading, error };
};
