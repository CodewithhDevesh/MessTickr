import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";

export default function About() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/MessI1.png')" }}
    >
      <div className="min-h-screen bg-black/30">
        <Navbar/>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <h1 className="text-4xl font-bold mb-6 text-white text-center">
            About MessTickr
          </h1>

          <div className="max-w-3xl text-black bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-md text-center space-y-4">
            <p>
              <strong>MessTickr</strong> is a smart mess meal tracking platform designed to revolutionize the way students and mess admins manage meals. Our primary goal is to reduce food waste by offering real-time meal confirmations, smart analytics, and a seamless feedback system.
            </p>
            <p>
              The idea for this platform originated from the common challenges faced in Indian hostels, where excess food is often wasted due to lack of real-time data on student preferences. MessTickr empowers both students and mess workers to collaborate through technology — ensuring sustainable and efficient dining operations.
            </p>
            <p>
              Whether you're running a mess or enjoying meals in one, MessTickr makes the experience smarter, simpler, and more transparent. Join us in our mission to build a more conscious and tech-enabled food ecosystem.
            </p>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => navigate("/")}
              className="bg-purple-800 hover:bg-[#5b30a6] text-white rounded-none"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
