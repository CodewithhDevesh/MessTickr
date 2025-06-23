import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setLoading } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
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
      <div className="min-h-screen bg-black/30">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <form
            onSubmit={submitHandler}
            className="w-[90%] sm:w-[70%] md:w-1/2 lg:w-1/3 bg-white/40 backdrop-blur-md p-8 rounded-xl shadow-md"
          >
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Create Your Account
            </h1>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold my-2">Full Name</Label>
                <Input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                  className="placeholder:text-black"
                />
              </div>

              <div>
                <Label className="font-semibold my-2">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="you@example.com"
                  className="placeholder:text-black"
                />
              </div>

              <div>
                <Label className="font-semibold my-2">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Enter Password"
                  className="placeholder:text-black"
                />
              </div>

              <div>
                <Label className="font-semibold my-2">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={changeEventHandler}
                  placeholder="Re-enter Password"
                  className="placeholder:text-black"
                />
              </div>

              <RadioGroup className="flex gap-6 mt-4">
                {/* Student */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={() => setInput({ ...input, role: "student" })}
                    className="hidden peer"
                  />
                  <div className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center peer-checked:border-purple-800 peer-checked:ring-2 peer-checked:ring-purple-800">
                    <div
                      className={`w-2.5 h-2.5 bg-purple-800 rounded-full transition-opacity ${
                        input.role === "student" ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                  </div>
                  <span className="font-medium">Student</span>
                </label>

                {/* Admin */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={input.role === "admin"}
                    onChange={() => setInput({ ...input, role: "admin" })}
                    className="hidden peer"
                  />
                  <div className="w-5 h-5 border-2 border-black rounded-full flex items-center justify-center peer-checked:border-purple-800 peer-checked:ring-2 peer-checked:ring-purple-800">
                    <div
                      className={`w-2.5 h-2.5 bg-purple-800 rounded-full transition-opacity ${
                        input.role === "admin" ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                  </div>
                  <span className="font-medium">Admin</span>
                </label>
              </RadioGroup>

              {loading ? (
                <Button disabled className="w-full mt-4 rounded-none">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full mt-4 bg-purple-800 hover:bg-[#5b30a6] rounded-none"
                >
                  Signup
                </Button>
              )}

              <div className="flex justify-between text-sm mt-4 text-black">
                <span>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-800 font-semibold hover:underline"
                  >
                    Login
                  </Link>
                </span>
                <Link
                  to="/forgot"
                  className="text-purple-800 font-semibold hover:underline"
                >
                  Forgot Password
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
