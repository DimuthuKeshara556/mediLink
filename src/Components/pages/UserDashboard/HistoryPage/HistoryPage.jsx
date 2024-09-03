import React, { useEffect, useState } from "react";
import getDataFromSubCollection from "../../../../Utils/dataFetch/getDataFromSubCollection";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../../../../Firebase/firebase";
import { orderBy } from "firebase/firestore/lite";
import { useAuth } from "../../../AuthContext/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";

const HistoryPage = () => {
  const { uid } = useAuth();
  const [doctorData, setDoctorData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, [uid]);
  useEffect(() => {
    getDataFromCollection("hospital", setHospitalData);
  }, [uid]);

  const [sortAppointments, setSortAppointments] = useState([]);

  const dateFilteredAppointments = sortAppointments?.filter(
    ({ status }) => status === "complete"
  );

  const getSortedAppointments = async () => {
    try {
      const appointmentRef = collection(
        firestore,
        "appointments",
        uid,
        "appointments"
      );
      const q = query(appointmentRef, orderBy("SheduledDate"));

      const querySnapshot = await getDocs(q);
      const sortAppointments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return sortAppointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getSortedAppointments();
      setSortAppointments(data);
    };

    fetchAppointments();
  }, [uid]);

  return (
    <div className="w-full h-screen flex justify-center md:justify-end">
      <div className="h-screen w-full md:w-5/6 mt-14 md:mt-20 px-5 md:px-10">
        <section className="flex flex-col md:flex-row w-full items-start gap-10 mt-10">
          <div className="w-full ">
            <p className="text-[17px] font-medium mb-10">Appoitment History </p>

            <TableContainer component={Paper} className="shadow-lg rounded-lg">
              <Table className="min-w-full">
                <TableHead>
                  <TableRow className="bg-accent">
                    <TableCell>Doctor</TableCell>
                    <TableCell>Doctor Name</TableCell>
                    <TableCell>Speciality</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time Slot</TableCell>
                    <TableCell>Hospital</TableCell>
                    <TableCell>Hospital Location</TableCell>
                    <TableCell>Hospital Email</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dateFilteredAppointments?.map(
                    (
                      { SheduledDate, time, hospital, docId, status },
                      index
                    ) => {
                      const doctor = Object.values(doctorData).find(
                        (doc) => doc.dataId === docId
                      );
                      const hospitalDoc = Object.values(hospitalData).find(
                        (doc) => doc.dataId === hospital
                      );
                      return (
                        <TableRow
                          key={index}
                          className="bg-white hover:bg-gray-100 "
                        >
                          <TableCell className="p-2">
                            <Avatar
                              src={doctor?.img}
                              alt="profileImage"
                              className="w-[25px] h-[25px] rounded-full shadow-lg"
                            />
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {doctor?.name}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {doctor?.speciality}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {SheduledDate}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {time}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {hospitalDoc?.name}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {hospitalDoc?.location}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {hospitalDoc?.email}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {status}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
