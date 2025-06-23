import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Password reset successfully! Please login now.");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Reset failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
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
            onSubmit={handleResetPassword}
            className="w-[90%] sm:w-[70%] md:w-1/2 lg:w-1/3 bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-md"
          >
            <h1 className="text-2xl font-bold text-center mb-5 text-gray-900">
              Reset Password
            </h1>

            <div className="mb-6">
              <Label htmlFor="newPassword" className="font-medium mb-2 block">
                New Password
              </Label>
              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="placeholder:text-black"
              />
            </div>

            {loading ? (
              <Button className="w-full bg-purple-800" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-purple-800 hover:bg-[#5b30a6] rounded-none"
              >
                Reset Password
              </Button>
            )}
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
