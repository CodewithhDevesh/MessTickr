import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import { MESS_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { motion } from "framer-motion";

export default function EnrollMess() {
  const [input, setInput] = useState({
    name: "",
    location: "",
    adminEmail: "",
    contactNumber: "",
  });

  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${MESS_API_END_POINT}/register`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url(/MessI1.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen"
    >
      <div className="bg-black/40 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={submitHandler}
            className="w-full md:w-2/3 lg:w-1/2 bg-white/60 backdrop-blur-md p-6 sm:p-8 md:p-10 my-10 rounded-xl shadow-2xl"
          >
            <h1 className="text-2xl font-bold text-center mb-6">
              Enroll Your Mess
            </h1>

            <div className="mb-4 flex flex-col gap-2">
              <Label className="font-semibold">Mess Name</Label>
              <Input
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                placeholder="e.g. Sunrise Mess"
                required
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <Label className="font-semibold">Institute / Mess Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="e.g. ABC Institute, Delhi"
                required
              />
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <Label className="font-semibold">Admin Email</Label>
              <Input
                type="email"
                name="adminEmail"
                value={input.adminEmail}
                onChange={changeEventHandler}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <Label className="font-semibold">Contact Number</Label>
              <Input
                name="contactNumber"
                value={input.contactNumber}
                onChange={changeEventHandler}
                placeholder="e.g. +91 9876543210"
                required
              />
            </div>

            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-purple-800 hover:bg-purple-700 transition-transform duration-200 hover:scale-[1.02] rounded-xl"
              >
                Enroll Mess
              </Button>
            )}

            <div className="w-full flex justify-between items-center mt-4">
              <span
                className="text-sm text-purple-700 hover:text-purple-900 cursor-pointer transition"
                onClick={() => navigate(-1)}
              >
                ← Back
              </span>
              <span
                className="text-sm text-purple-700 hover:text-purple cursor-pointer transition"
                onClick={() => navigate("/getMess")}
              >
                View Messes
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
