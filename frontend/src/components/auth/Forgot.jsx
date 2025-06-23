import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Reset link sent! Check your email.");
        setEmail("");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/MessI2.png')" }}
    >
      <div className="min-h-screen bg-black/30">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <form
            onSubmit={handleForgotPassword}
            className="w-[90%] sm:w-[70%] md:w-1/2 lg:w-1/3 bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-3 text-gray-900">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Enter your email to receive a password reset link.
            </p>

            <div className="relative mb-6">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 placeholder:text-black"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-800 hover:bg-[#5b30a6] rounded-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
