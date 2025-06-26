import React, { useState } from "react";
import useGetAnnouncementsByMess from "@/hooks/useGetAnnouncementsByMess";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Announcements() {
  const { user } = useSelector((state) => state.auth);
  const messId = user?.profile?.mess;

  const { announcements, loading, error } = useGetAnnouncementsByMess(messId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.mess?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/MessI2.png')" }}
    >
      <div className="min-h-screen bg-black/30">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 min-h-[calc(100vh-4rem)] flex flex-col">
          <h1 className="text-4xl font-bold mb-8 text-center text-white">
            Mess Announcements
          </h1>

          {/* Search Input */}
          <div className="mb-6 flex justify-center">
            <Input
              type="text"
              placeholder="🔍 Search by mess name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 bg-white/20 text-white placeholder-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {!messId ? (
              <div className="text-center text-lg text-red-400">
                You haven't selected a mess yet.
              </div>
            ) : loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="text-center text-gray-300">
                No announcements match your search.
              </div>
            ) : (
              <ul className="space-y-6">
                {filteredAnnouncements.map(
                  ({ _id, message, createdAt, createdBy, mess }) => (
                    <li
                      key={_id}
                      className="bg-white/30 backdrop-blur-lg border border-white/20 p-5 rounded-lg shadow-md hover:shadow-xl transition text-black"
                    >
                      <p className="text-lg whitespace-pre-line font-medium">
                        {message}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-between text-sm text-black/60">
                        <span>By: {createdBy?.fullname || "Admin"}</span>
                        <span>Mess: {mess?.name || "Unknown"}</span>
                        <span>{new Date(createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => window.history.back()}
              className="bg-purple-800 hover:bg-[#5b30a6] text-white"
            >
              ← Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
