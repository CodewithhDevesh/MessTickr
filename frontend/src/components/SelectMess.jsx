import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { MESS_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setMesses,
  setSearchMessByText,
  setSelectedMess,
  selectSelectedMess,
  selectFilteredMesses,
} from "@/redux/messSlice";
import useGetSelectedMess from "@/hooks/useGetSelectedMess";
import { setUser } from "@/redux/authSlice";

export default function SelectMess() {
  const [selectedMess, setSelectedMessLocal] = useState(null);
  const [loadingMesses, setLoadingMesses] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useGetSelectedMess(user?.userId);

  const selectedMessFromStore = useSelector((state) =>
    selectSelectedMess(state, user?.userId)
  );
  const filteredMesses = useSelector(selectFilteredMesses);

  useEffect(() => {
    setSelectedMessLocal(null);
  }, [user]);

  useEffect(() => {
    if (selectedMessFromStore) {
      setSelectedMessLocal(selectedMessFromStore.mess);
    }
  }, [selectedMessFromStore]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMesses = async () => {
      try {
        setLoadingMesses(true);
        const res = await axios.get(`${MESS_API_END_POINT}/all`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setMesses(res.data.data));
        } else {
          toast.error("Failed to fetch messes");
        }
      } catch (error) {
        toast.error("Error fetching messes");
        console.error(error);
      } finally {
        setLoadingMesses(false);
      }
    };

    fetchMesses();
  }, [user, navigate, dispatch]);

  const handleSelect = async () => {
    if (!selectedMess) {
      toast.error("Please select a mess first.");
      return;
    }

    try {
      setLoadingSelect(true);
      const res = await axios.post(
        `${MESS_API_END_POINT}/select`,
        {
          messId: selectedMess._id,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Mess selected successfully.");
        dispatch(setSelectedMess({ userId: user.userId, mess: selectedMess }));
        dispatch(setUser({ ...user, mess: selectedMess }));
        setIsEditing(false);
        navigate("/meal-confirmation");
      } else {
        toast.error(res.data.message || "Failed to select mess");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error selecting mess");
      console.error("Select mess error:", error);
    } finally {
      setLoadingSelect(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/MessI1.png')" }}
    >
      <div className="bg-black/60 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
              Select Your Mess
            </h1>

            {selectedMessFromStore && !isEditing && (
              <div className="mb-6 p-4 bg-green-100 border border-green-600 rounded text-sm text-green-900">
                <h2 className="font-semibold mb-1">You have already selected:</h2>
                <p><strong>Name:</strong> {selectedMessFromStore.name}</p>
                <p><strong>Location:</strong> {selectedMessFromStore.location}</p>
                <p><strong>Contact:</strong> {selectedMessFromStore.contactNumber}</p>
                <Button
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Change Mess
                </Button>
              </div>
            )}

            <input
              type="text"
              placeholder="Search mess by name..."
              onChange={(e) => dispatch(setSearchMessByText(e.target.value))}
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={selectedMessFromStore && !isEditing}
            />

            {loadingMesses && filteredMesses.length === 0 ? (
              <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-700" />
                <p className="mt-2">Loading messes...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {filteredMesses.length === 0 ? (
                  <p className="text-center text-gray-700">No messes found.</p>
                ) : (
                  filteredMesses.map((mess) => (
                    <button
                      key={mess._id}
                      onClick={() => setSelectedMessLocal(mess)}
                      disabled={!!selectedMessFromStore && !isEditing}
                      className={`w-full text-left p-4 rounded border shadow-sm transition ${
                        selectedMess?._id === mess._id
                          ? "bg-purple-100 border-purple-700"
                          : "bg-white border-gray-300"
                      } ${
                        selectedMessFromStore && !isEditing
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md hover:border-purple-500"
                      }`}
                    >
                      <h2 className="text-lg font-semibold">{mess.name}</h2>
                      <p className="text-sm text-gray-700">{mess.location}</p>
                      <p className="text-xs text-gray-600">Contact: {mess.contactNumber}</p>
                    </button>
                  ))
                )}
              </div>
            )}

            <Button
              className="w-full mt-6 bg-purple-800 hover:bg-purple-900"
              onClick={handleSelect}
              disabled={loadingSelect || !selectedMess || (!!selectedMessFromStore && !isEditing)}
            >
              {loadingSelect ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : selectedMessFromStore && !isEditing ? (
                "Mess Already Selected"
              ) : (
                "Confirm Selection"
              )}
            </Button>

            <button
              type="button"
              className="text-sm mt-3 underline text-gray-800 hover:text-purple-800"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
