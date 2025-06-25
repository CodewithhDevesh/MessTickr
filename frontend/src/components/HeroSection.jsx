import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSection() {
  const lines = [
    "Track student meal preferences in real time. Reduce food waste. Simplify mess operations.",
    "Seamless mess enrollment, real-time confirmations, and transparent feedback – all in one place.",
    "Efficient. Sustainable. Student-first.",
  ];

  const { user } = useSelector((store) => store.auth);
  const [currentLine, setCurrentLine] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  // Dynamic line change effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentLine((prev) => (prev + 1) % lines.length);
        setFade(true);
      }, 500); // Matches transition-opacity duration
    }, 4000); // Change line every 4 seconds

    return () => clearInterval(interval);
  }, [lines.length]);

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <h1 className="text-5xl font-bold text-white">Welcome to MessTickr</h1>
        <p
          className={`text-center text-gray-100 text-base md:text-lg font-medium transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {lines[currentLine]}
        </p>

        {/* <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Search mess, feature or feedback"
            className="outline-none border-none w-full text-white bg-transparent placeholder:text-gray-300"
          />
          <Button className="rounded-r-full">
            <Search className="h-5 w-5" />
          </Button>
        </div> */}

        <div className="flex items-center justify-center gap-5">
          {user && user.role === "student" && (
            <Button
              className="w-36 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-none my-4"
              onClick={() => navigate("/meal-confirmation")}
            >
              Meal Confirmation
            </Button>
          )}
          {user && user.role === "admin" && (
            <Button
              className="w-36 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-none my-4"
              onClick={() => navigate("/getMess")}
            >
              View Mess
            </Button>
          )}
          {!user && (
            <Button
              className="w-36 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-none my-4"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
