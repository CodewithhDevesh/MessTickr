import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { MEAL_API_END_POINT } from "@/utils/constant";

const useGetConfirmation = (dateToCheck) => {
  const { user } = useSelector((store) => store.auth);
  const [preferences, setPreferences] = useState({
    breakfast: false,
    lunch: false,
    noshes: false,
    dinner: false,
  });
  const [hasPreferences, setHasPreferences] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.userId || !dateToCheck) return;

      try {
        const res = await axios.get(
          `${MEAL_API_END_POINT}/${user.userId}/${dateToCheck}`,
          { withCredentials: true }
        );

        const prefs = res.data?.data;

        if (res.data.success && prefs) {
          setPreferences({
            breakfast: prefs.breakfast || false,
            lunch: prefs.lunch || false,
            noshes: prefs.noshes || false,
            dinner: prefs.dinner || false,
          });
          setHasPreferences(true);
          setLastUpdated(prefs.updatedAt || null);
        } else {
          setHasPreferences(false);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setHasPreferences(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user, dateToCheck]);

  return { preferences, hasPreferences, lastUpdated, loading };
};

export default useGetConfirmation;
