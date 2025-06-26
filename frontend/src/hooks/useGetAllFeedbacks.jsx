import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFeedbacks } from "@/redux/feedbackSlice";
import { FEEDBACK_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const useGetAllFeedbacks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${FEEDBACK_API_END_POINT}/all`);
        console.log("printing the data ->",res.data);
        
        dispatch(setFeedbacks(res.data.feedbacks));
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        toast.error("Failed to fetch feedbacks");
      }
    };

    fetchFeedbacks();
  }, [dispatch]);
};

export default useGetAllFeedbacks;