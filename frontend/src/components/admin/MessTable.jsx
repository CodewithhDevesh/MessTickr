import React from "react";
import { useSelector } from "react-redux";
import { selectFilteredMesses } from "@/redux/messSlice";
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

export default function MessTable() {
  const messes = useSelector(selectFilteredMesses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full overflow-x-auto"
    >
      <Table className="min-w-[800px] border-collapse rounded-lg shadow-md overflow-hidden">
        <TableCaption className="text-gray-500 mt-2">List of messes</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left font-semibold text-sm sm:text-base">Mess Name</TableHead>
            <TableHead className="text-left font-semibold text-sm sm:text-base">Location</TableHead>
            <TableHead className="text-left font-semibold text-sm sm:text-base">Admin Email</TableHead>
            <TableHead className="text-left font-semibold text-sm sm:text-base">Contact No.</TableHead>
            <TableHead className="text-left font-semibold text-sm sm:text-base">Registered At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {messes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
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
                <TableCell className="text-left">{mess.name}</TableCell>
                <TableCell className="text-left">{mess.location}</TableCell>
                <TableCell className="text-left">{mess.adminEmail}</TableCell>
                <TableCell className="text-left">
                  {mess.contactNumber || "-"}
                </TableCell>
                <TableCell className="text-left">
                  {new Date(mess.registeredAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
