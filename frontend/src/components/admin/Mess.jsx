import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import MessTable from "./MessTable";
import { useDispatch } from "react-redux";
import { setSearchMessByText } from "@/redux/messSlice";
import useGetAllMess from "@/hooks/useGetAllMess";
import useGetMessById from "@/hooks/useGetMessById";
import { motion } from "framer-motion";

export default function Mess() {
  const [input, setInput] = useState("");
  const [showOwn, setShowOwn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetAllMess(!showOwn);
  useGetMessById(showOwn);

  useEffect(() => {
    dispatch(setSearchMessByText(input));
  }, [input]);

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

        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-11/12 mt-10 mb-16 bg-white/70 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <Input
                className="w-full sm:w-72 text-black bg-white placeholder:text-gray-600 border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 transition-all duration-200 focus:outline-none rounded-md px-4 py-2"
                placeholder="Filter by mess name"
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Button
                  className="bg-purple-800 hover:bg-purple-700 transition-transform duration-200 hover:scale-[1.03]"
                  onClick={() => navigate("/register-mess")}
                >
                  Enroll New Mess
                </Button>

                <Button
                  variant={showOwn ? "secondary" : "default"}
                  onClick={() => setShowOwn((prev) => !prev)}
                  className="transition-colors duration-200"
                >
                  {showOwn ? "Show All Messes" : "Show Your Messes"}
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MessTable />
            </motion.div>

            <div className="text-left mt-4">
              <span
                className="text-sm cursor-pointer text-purple-700 hover:text-purple-900 transition"
                onClick={() => navigate("/")}
              >
                ← Back
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
