import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMesses } from "@/redux/messSlice";
import { MESS_API_END_POINT } from "@/utils/constant"; 
import axios from "axios";

const useGetAllMess = (shouldFetch = true) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchMesses = async () => {
      try {
        const res = await axios.get(`${MESS_API_END_POINT}/all`, {
          withCredentials: true,
        });
        if (res.data.success && isMounted) {
          dispatch(setMesses(res.data.data));
        }
      } catch (error) {
        console.error("Error fetching messes:", error);
      }
    };

    if (shouldFetch) fetchMesses();

    return () => {
      isMounted = false;
    };
  }, [dispatch, shouldFetch]);
};

export default useGetAllMess;
