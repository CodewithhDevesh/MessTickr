import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMesses } from "@/redux/messSlice";
import { MESS_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const useGetMessById = (shouldFetch = false) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Assuming auth slice has logged-in user
  console.log(user);
  
  useEffect(() => {
    const fetchOwnMess = async () => {
      try {
        const res = await axios.get(`${MESS_API_END_POINT}/${user.userId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const messData = res.data.data;

          // If it's a single mess, wrap it in array for compatibility
          dispatch(setMesses(Array.isArray(messData) ? messData : [messData]));
        }
      } catch (error) {
        console.error("Error fetching own mess:", error);
      }
    };

    if (shouldFetch && user?.userId) fetchOwnMess();
  }, [dispatch, shouldFetch, user]);
};

export default useGetMessById;
