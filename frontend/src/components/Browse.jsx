import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { MESS_API_END_POINT } from "@/utils/constant";
import { setMesses, setSearchMessByText } from "@/redux/messSlice";
import { useNavigate } from "react-router-dom";
import useGetAllFeedbacks from "@/hooks/useGetAllFeedbacks";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Input } from "./ui/input";

export default function Browse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messes, searchText } = useSelector((state) => state.mess);
  const { feedbacks } = useSelector((state) => state.feedback);

  useGetAllFeedbacks();

  const fetchMesses = async () => {
    try {
      const response = await axios.get(`${MESS_API_END_POINT}/all`);
      dispatch(setMesses(response.data.messes || []));
    } catch (error) {
      toast.error("Failed to fetch mess data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMesses();
    return () => {
      dispatch(setSearchMessByText(""));
    };
  }, []);

  const filteredMesses = messes.filter((mess) =>
    mess.name.toLowerCase().includes(searchText.toLowerCase()) ||
    mess.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAverageRating = (messId) => {
    const relevantFeedbacks = feedbacks.filter((f) => f.messId === messId);
    if (!relevantFeedbacks.length) return null;
    const avg =
      relevantFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
      relevantFeedbacks.length;
    return avg.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[url('/MessI2.png')] bg-cover bg-center">
      <div className="min-h-screen bg-black/70">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-12 text-white">
          <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-violet-300 to-violet-500 bg-clip-text text-transparent">
            Browse Messes
          </h1>

          {/* Search */}
          <div className="flex justify-center mb-10">
            <Input
              placeholder="🔍 Search by Mess, College, or City"
              className="w-full max-w-xl px-4 py-3 bg-white/10 backdrop-blur-lg text-white placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              value={searchText}
              onChange={(e) => dispatch(setSearchMessByText(e.target.value))}
            />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            Search Results ({filteredMesses.length})
          </h2>

          {filteredMesses.length === 0 ? (
            <p className="text-center text-white/70">No messes match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMesses.map((mess) => (
                <Card
                  key={mess._id}
                  onClick={() => navigate("/select-mess")}
                  className="bg-white/90 text-black rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-violet-700">{mess.name}</h3>
                    <p><span className="font-semibold">📍 Location:</span> {mess.location}</p>
                    <p><span className="font-semibold">📞 Contact:</span> {mess.contactNumber}</p>
                    <p><span className="font-semibold">⭐ Rating:</span> {getAverageRating(mess._id) || "N/A"}</p>
                    <p className="text-sm text-gray-600 italic">
                      Known for quality and hygiene.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
