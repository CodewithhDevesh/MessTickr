import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFilteredMesses, setMesses } from "@/redux/messSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { MESS_API_END_POINT } from "@/utils/constant";
import { Trash2 } from "lucide-react";

export default function MessTable() {
  const messes = useSelector(selectFilteredMesses);
  const dispatch = useDispatch();
  console.log(messes);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mess?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.get(`${MESS_API_END_POINT}/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Mess deleted successfully!");
        const updated = messes.filter((m) => m._id !== id);
        dispatch(setMesses(updated));
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full overflow-x-auto"
    >
      <Table className="min-w-[900px] border-collapse rounded-lg shadow-md overflow-hidden">
        <TableCaption className="text-gray-500 mt-2">
          List of messes
        </TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Mess Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Admin Email</TableHead>
            <TableHead>Contact No.</TableHead>
            <TableHead>Registered At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {messes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-gray-600 italic"
              >
                No messes found.
              </TableCell>
            </TableRow>
          ) : (
            messes.map((mess) => (
              <TableRow
                key={mess._id}
                className="hover:bg-purple-50 transition duration-200"
              >
                <TableCell>{mess.name}</TableCell>
                <TableCell>{mess.location}</TableCell>
                <TableCell>{mess.adminEmail}</TableCell>
                <TableCell>{mess.contactNumber || "-"}</TableCell>
                <TableCell>
                  {new Date(mess.registeredAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(mess._id)}
                    className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
                    title="Delete Mess"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
