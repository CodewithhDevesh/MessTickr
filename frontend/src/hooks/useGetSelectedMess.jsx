import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSelectedMess } from "@/redux/messSlice";
import { MESS_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const useGetSelectedMess = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!userId) return;
    const fetchSelectedMess = async () => {
      try {
        const res = await axios.get(`${MESS_API_END_POINT}/selected/${userId}`, {
          withCredentials: true,
        });
      //  console.log("printing the response",res);
        
        if (res.data.success && res.data.data) {
          dispatch(setSelectedMess({ userId, mess: res.data.data }));
        }
      } catch (error) {
        console.error("Failed to fetch selected mess:", error);
        toast.error("Could not fetch selected mess.");
      }
    };

    fetchSelectedMess();
  }, [userId, dispatch]);
};

export default useGetSelectedMess;
