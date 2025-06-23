import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  return (
    <div
      style={{ backgroundImage: "url(/MessI2.png)" }}
      className="min-h-screen bg-cover bg-center"
    >
      <div className="bg-black/40 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
          <motion.form
            onSubmit={submitHandler}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white/40 backdrop-blur-md p-6 rounded-lg mt-16 shadow-md"
          >
            <div className="text-center">
              <h1 className="font-bold text-2xl mb-6 text-gray-800">Member Sign-In</h1>
            </div>

            <div className="mb-4">
              <Label className="font-bold text-md text-black">Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="D@N.com"
                className="mt-1 placeholder:text-black"
              />
            </div>

            <div className="mb-4">
              <Label className="font-bold text-md text-black">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter Password"
                className="mt-1 placeholder:text-black"
              />
            </div>

            <div className="my-4">
              <RadioGroup className="flex items-center gap-6">
                {["student", "admin"].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={input.role === role}
                      onChange={() => setInput({ ...input, role })}
                      className="hidden peer"
                    />
                    <div className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center 
                      peer-checked:border-purple-800 peer-checked:ring-2 peer-checked:ring-purple-800 transition-all">
                      <div className={`w-2.5 h-2.5 bg-purple-800 rounded-full transition-all ${
                        input.role === role ? "opacity-100" : "opacity-0"
                      }`}></div>
                    </div>
                    <span className="font-medium capitalize">{role}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {loading ? (
              <Button className="w-full my-4 rounded-md" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full my-4 bg-purple-800 hover:bg-purple-900 text-white rounded-md transition-all"
              >
                Login
              </Button>
            )}

            <div className="flex flex-col sm:flex-row justify-between text-sm mt-2 text-black">
              <span>
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-800 font-bold hover:underline">
                  Signup
                </Link>
              </span>
              <Link to="/forgot" className="text-purple-800 font-bold hover:underline mt-1 sm:mt-0">
                Forgot Password
              </Link>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
