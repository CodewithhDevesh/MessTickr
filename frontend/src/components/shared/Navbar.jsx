import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { Popover, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, Settings, User2, Menu } from "lucide-react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    if (!selectedFile) return toast.error("Please select a file first.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      setUploading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Profile picture updated!");
        setSelectedFile(null);
        dispatch(setUser(res.data.updatedUser));
      } else toast.error("Upload failed. Try again.");
    } catch (err) {
      toast.error("Failed to upload profile picture.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#E1D7B9] h-20 shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-0 z-10">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          <h1 className="text-2xl font-bold whitespace-nowrap">
            <Link to="/">Mess<span className="text-[#5A1D9A]">Tickr</span></Link>
          </h1>
        </div>

       <div className="flex-1 hidden md:flex justify-center mr-20">
          <ul className="flex gap-6 items-center font-medium">
            {user?.role === "admin" ? (
              <>
                <li><Link to="/register-mess">Mess Connect</Link></li>
                <li><Link to="/announcement">Announcement</Link></li>
                <li><Link to="/confirmations">View Confirmations</Link></li>
                <li><Link to="/viewFeedback">View Feedbacks</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/announcement">Announcements</Link></li>
                <li><Link to="/about-us">About us</Link></li>
                <li><Link to="/browse">Browse</Link></li>
                {user && (
                  <>
                    <li><Link to="/meal-confirmation">Meals</Link></li>
                    <li><Link to="/select-mess">Select mess</Link></li>
                  </>
                )}
                {user && (
                  <li
                    onClick={() => navigate(`/feedback/${user?.userId}`)}
                    className="cursor-pointer"
                  >
                    Feedback
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Right: Avatar/Login */}
        <div className="flex items-center z-10 gap-2">
          {/* Hamburger Icon */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>

          {!user ? (
            <Button
              className="rounded-full w-28 bg-transparent text-black border border-black hover:text-white hover:bg-black"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.photoUrl} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-4 mb-3">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={user?.profile?.photoUrl} />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.role === "admin" ? "Admin" : "Student"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col text-gray-600">
                    {user?.role === "admin" && (
                      <>
                        <div
                          className="flex items-center gap-2 cursor-pointer mb-2"
                          onClick={() => navigate(`/settings/${user.userId}`)}
                        >
                          <Settings className="w-5 h-5" />
                          <Button variant="link">Settings</Button>
                        </div>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium mb-2">Update Profile Picture</p>
                          <div className="flex flex-col items-center gap-2">
                            {selectedFile ? (
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="w-20 h-20 rounded-full object-cover shadow"
                              />
                            ) : (
                              <Avatar className="w-20 h-20">
                                <AvatarImage src={user?.profile?.photoUrl} />
                              </Avatar>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm mt-1" />
                            <Button
                              onClick={handleUpdateProfile}
                              disabled={uploading}
                              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-sm"
                            >
                              {uploading ? "Uploading..." : "Upload"}
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                    {user?.role === "student" && (
                      <div className="flex items-center gap-2 cursor-pointer mt-2">
                        <User2 className="w-4 h-4" />
                        <Button variant="link" className="p-0 h-auto">
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 cursor-pointer mt-2">
                      <LogOut className="w-4 h-4" />
                      <Button onClick={logoutHandler} variant="link" className="p-0 h-auto">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#E1D7B9] p-4 shadow-md">
          <ul className="flex flex-col gap-4 items-center font-medium">
            {user?.role === "admin" ? (
              <>
                <li><Link to="/register-mess">Mess Connect</Link></li>
                <li><Link to="/announcement">Announcement</Link></li>
                <li><Link to="/confirmations">View Confirmations</Link></li>
                <li><Link to="/viewFeedback">View Feedbacks</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/announcement">Announcements</Link></li>
                <li><Link to="/about-us">About us</Link></li>
                <li><Link to="/browse">Browse</Link></li>
                {user && (
                  <>
                    <li><Link to="/meal-confirmation">Meals</Link></li>
                    <li><Link to="/select-mess">Select mess</Link></li>
                    <li
                      onClick={() => navigate(`/feedback/${user?.userId}`)}
                      className="cursor-pointer"
                    >
                      Feedback
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
