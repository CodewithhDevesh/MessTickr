import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ANNOUNCEMENT_API_END_POINT } from "@/utils/constant";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Announce() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMessId, setSelectedMessId] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { messes } = useSelector((store) => store.mess);
  const isAdmin = user?.role === "admin";

  const backgroundImage = isAdmin ? "/MessI1.png" : "/MessI.png";

  const adminMesses = messes.filter((mess) => {
    const creatorId =
      typeof mess.createdBy === "string"
        ? mess.createdBy
        : mess.createdBy?._id;
    return creatorId === user._id;
  });

  const selectedMessName =
    adminMesses.find((mess) => mess._id === selectedMessId)?.name || "";

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ANNOUNCEMENT_API_END_POINT}/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const filtered = res.data.announcements.filter(
          (a) => a?.mess?.createdBy?._id === user._id
        );
        setAnnouncements(filtered);
      } else {
        toast.error(res.data.message || "Failed to fetch announcements.");
      }
    } catch (error) {
      toast.error("Error fetching announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty.");
    if (!selectedMessId) return toast.error("Please select a mess.");

    try {
      setLoadingCreate(true);
      const res = await axios.post(
        `${ANNOUNCEMENT_API_END_POINT}/create`,
        {
          message,
          mess: selectedMessId,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Announcement created.");
        setMessage("");
        setSelectedMessId("");
        fetchAnnouncements();
      } else {
        toast.error(res.data.message || "Failed to create announcement.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating announcement."
      );
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.get(
        `${ANNOUNCEMENT_API_END_POINT}/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Announcement deleted.");
        fetchAnnouncements();
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting announcement."
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black/50 backdrop-blur-sm min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
            Announcements
          </h1>

          {isAdmin && (
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-xl mb-10 space-y-4 animate-fade-in transition-all duration-500">
              <h2 className="text-xl font-semibold text-white">
                Create New Announcement
              </h2>

              <div>
                <label className="text-white text-sm mb-1 block">
                  Select Mess
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-white/80 text-black hover:bg-white"
                    >
                      {selectedMessName || "Select a mess"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-white shadow-xl animate-slide-up">
                    <Command>
                      <CommandInput placeholder="Search mess..." />
                      <CommandEmpty>No mess found.</CommandEmpty>
                      <CommandGroup>
                        {adminMesses.map((mess) => (
                          <CommandItem
                            key={mess._id}
                            value={mess.name}
                            onSelect={() => {
                              setSelectedMessId(mess._id);
                              setOpen(false);
                            }}
                          >
                            {mess.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <textarea
                rows={4}
                className="w-full p-3 rounded-md bg-white/80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your announcement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loadingCreate}
              />

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold hover:scale-105 transition-transform"
                onClick={handleCreate}
                disabled={loadingCreate}
              >
                {loadingCreate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Announcement"
                )}
              </Button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-purple-300" />
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-center text-white text-lg">
              No announcements yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {announcements.map(
                ({ _id, message, createdAt, createdBy, mess }) => (
                  <li
                    key={_id}
                    className="p-5 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl text-white shadow hover:shadow-xl transition-shadow duration-300"
                  >
                    <p className="text-lg whitespace-pre-line">{message}</p>
                    <div className="mt-2 flex flex-wrap justify-between text-sm text-white/70">
                      <span>By: {createdBy?.fullname || "Admin"}</span>
                      <span>Mess: {mess?.name || "N/A"}</span>
                      <span>{new Date(createdAt).toLocaleDateString()}</span>
                    </div>

                    {isAdmin && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </li>
                )
              )}
            </ul>
          )}

          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur rounded-xl transition-transform hover:scale-105"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
