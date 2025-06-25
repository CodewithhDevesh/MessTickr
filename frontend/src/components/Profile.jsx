import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Mail, Pen } from "lucide-react";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/MessI2.png')" }}
    >
      <div className="bg-black/60 min-h-screen">
        <Navbar />

        <div className="flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md shadow-lg border border-gray-300 px-8 py-6 rounded-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Your Profile
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user?.profile?.photoUrl}
                    alt="Profile pic"
                  />
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {user?.fullname}
                  </h1>
                  <p className="text-gray-700 text-sm">
                    {user?.profile?.bio || "No bio available"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="hover:bg-purple-100 hover:text-purple-800"
              >
                <Pen className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>

            <div className="space-y-4 text-gray-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>{user?.email}</span>
              </div>

              <div>
                <p className="font-bold">Registered Mess:</p>
                {user?.mess?.name ? (
                  <div className="ml-4 mt-1 text-sm space-y-1">
                    <div>
                      <strong>Name:</strong> {user.mess.name}
                    </div>
                    <div>
                      <strong>Location:</strong> {user.mess.location}
                    </div>
                    <div>
                      <strong>Contact:</strong> {user.mess.contactNumber}
                    </div>
                  </div>
                ) : (
                  <p className="ml-4 text-sm text-red-600">Not Assigned</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <p className="font-bold">Branch:</p>
                <span>{user?.profile?.branch || "N/A"}</span>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-bold">Year:</p>
                <span>{user?.profile?.year || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => navigate("/")}
                className="mt-6 bg-purple-700 hover:bg-purple-800"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>

        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
