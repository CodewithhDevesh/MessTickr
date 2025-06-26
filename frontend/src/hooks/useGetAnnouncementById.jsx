import { useEffect, useState } from "react";
import axios from "axios";
import { ANNOUNCEMENT_API_END_POINT } from "@/utils/constant";

const useGetAnnouncementsByMess = (messId) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    if (!messId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${ANNOUNCEMENT_API_END_POINT}/by-mess?messId=${messId}`,
        { withCredentials: true }
      );

      if (res.data.success && res.data.announcements) {
        setAnnouncements(res.data.announcements);
        setError(null);
      } else {
        setError(res.data.message || "Failed to fetch announcements");
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [messId]);

  return { announcements, loading, error, refetch: fetchAnnouncements };
};

export default useGetAnnouncementsByMess;
