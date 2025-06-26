import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { FEEDBACK_API_END_POINT } from "@/utils/constant";
import { setLoading } from "@/redux/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminFeedback() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [feedbacks, setFeedbacksLocal] = useState([]);

  const fetchFeedbacks = async () => {
    if (user?.role !== "admin") return;

    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${FEEDBACK_API_END_POINT}/all`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setFeedbacksLocal(res.data.feedbacks);
      } else {
        toast.error(res.data.message || "Failed to fetch feedback");
      }
    } catch (err) {
      toast.error("Error fetching feedback");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div
      style={{ backgroundImage: "url(/MessI1.png)" }}
      className="min-h-screen bg-cover bg-center"
    >
      <div className="bg-black/40 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center max-w-7xl mx-auto px-4 py-10">
          <div className="w-full bg-white/40 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-2xl border border-gray-300">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-purple-900 drop-shadow">
              Student Feedbacks
            </h1>

            {feedbacks.length === 0 ? (
              <p className="text-center text-gray-700 text-lg">
                No feedback available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((fb, idx) => (
                  <Card
                    key={idx}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300 rounded-xl"
                  >
                    <CardHeader>
                      <CardTitle className="text-purple-800 text-lg sm:text-xl font-semibold">
                        {fb?.userId?.fullname || "Anonymous"}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm truncate">
                        {fb?.userId?.email}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Mess:</span>{" "}
                        {fb.messName || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Meal Type:</span>{" "}
                        <Badge variant="outline" className="capitalize">
                          {fb.mealType}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Rating:</span>{" "}
                        <span className="text-yellow-600 font-medium">
                          ⭐ {fb.rating}/5
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Comment:</span>
                        <div className="bg-gray-100 mt-1 px-3 py-2 rounded shadow-sm text-gray-800 text-sm">
                          {fb.comment || "No comment provided."}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
