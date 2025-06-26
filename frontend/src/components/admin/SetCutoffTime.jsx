import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MESS_API_END_POINT, SETTINGS_API_END_POINT } from "@/utils/constant";
import { setMesses } from "@/redux/messSlice";
import { motion } from "framer-motion";
import Select from "react-select";
import Footer from "../shared/Footer";

export default function SetCutoffTime() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const messes = useSelector((state) => state.mess.messes);
  const [selectedMessId, setSelectedMessId] = useState("");

  const [cutoffTime, setCutoffTime] = useState({
    breakfast: "07:30",
    lunch: "11:00",
    noshes: "15:30",
    dinner: "18:30",
  });

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await axios.get(
          `${MESS_API_END_POINT}/admin/${user.userId}/mess-preferences`,
          { withCredentials: true }
        );
        const messList = res.data.data.map((item) => item.mess);
        dispatch(setMesses(messList));
      } catch (error) {
        console.error("Error fetching messes:", error);
        toast.error("Failed to load messes");
      }
    };

    if (user?.role === "admin") {
      fetchMesses();
    }
  }, [user, dispatch]);

  const handleChange = (meal) => (e) => {
    setCutoffTime((prev) => ({
      ...prev,
      [meal]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedMessId) {
      toast.error("Please select a mess first.");
      return;
    }

    try {
      await axios.post(
        SETTINGS_API_END_POINT,
        { messId: selectedMessId, cutoffTime },
        { withCredentials: true }
      );
      toast.success("Cutoff times updated successfully!");
    } catch (error) {
      console.error("Error saving cutoff times:", error);
      toast.error(error?.response?.data?.message || "Failed to update cutoff times");
    }
  };

  const options = messes?.map((mess) => ({
    label: mess.name,
    value: mess._id,
  })) || [];

  return (
    <div
      style={{ backgroundImage: "url(/MessI1.png)" }}
      className="min-h-screen bg-cover bg-center"
    >
      <div className="bg-black/30 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl bg-white/70 backdrop-blur-md p-6 my-10 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-900">
            Set Cutoff Times
          </h1>

          <div className="my-4">
            <Label className="font-medium mb-1">Select Mess</Label>
            <Select
              options={options}
              placeholder="Search mess..."
              className="text-sm"
              onChange={(option) => setSelectedMessId(option.value)}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#d1d5db", // Tailwind border-gray-300
                  borderRadius: "0.375rem", // rounded-md
                  boxShadow: "none",
                  "&:hover": { borderColor: "#a78bfa" }, // hover:border-purple-400
                }),
              }}
            />
          </div>

          {["breakfast", "lunch", "noshes", "dinner"].map((meal) => (
            <div key={meal} className="my-4">
              <Label className="font-medium capitalize">{meal} Cutoff Time</Label>
              <Input
                type="time"
                value={cutoffTime[meal]}
                onChange={handleChange(meal)}
                className="mt-1 focus:ring-2 focus:ring-purple-400"
              />
            </div>
          ))}

          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-purple-800 hover:bg-purple-700 transition duration-300"
          >
            Save Cutoff Times
          </Button>

          <div className="mt-4 text-center">
            <span
              onClick={() => history.back()}
              className="text-sm text-purple-800 hover:underline cursor-pointer"
            >
              ← Back
            </span>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </div>
  );
}
