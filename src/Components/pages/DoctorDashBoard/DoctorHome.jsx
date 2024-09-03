import userImg from "../../../assets/Icons/defaultProfile.svg";
import settingsIcon from "../../../assets/Icons/settings.svg";
import calanderIcon from "../../../assets/Icons/calander.svg";
import moreIcon from "../../../assets/Icons/more.svg";
import minusIcon from "../../../assets/Icons/minus.png";
import { Link } from "react-router-dom";
import { DateCalendar } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";
import { useAuth } from "../../AuthContext/AuthContext";
import convertTimestampToFormattedString from "../../convertTimestampToFormattedString";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import db, { firestore } from "../../../Firebase/firebase";
import { useUser } from "../../UserContext/UserContext";
import noAppoinmentImg from "../../../assets/Images/no Appoinment.png";
import editProfile from "../../../assets/Icons/EditProfile.svg";

const DoctorHome = () => {
  const { uid } = useAuth();
  const { user } = useUser();
  const [sessionData, setSessionData] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [bookedDate, setBookedDate] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [doctorHospitalData, setDoctorHospitalData] = useState([]);
  const [filteredDoctorHospitalData, setFilteredDoctorHospitalData] = useState(
    []
  );
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const dayName = daysOfWeek[today.getDay()];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const toggleDropdown = (docId) => {
    setOpenDropdown((prev) => (prev === docId ? null : docId));
  };

  const getSessionData = async (collectionName, setData, uid) => {
    try {
      const q = query(collection(db, collectionName), orderBy("startTime"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    getSessionData("sessions", setSessionData, uid);
  }, [uid]);

  useEffect(() => {
    getDataFromCollection("patient", setPatientData);
  }, []);

  const dateFilteredAppointments = sessionData?.filter(
    ({ docId, status }) => docId === uid && status === "pending"
  );

  useEffect(() => {
    getDataFromCollection("doctorHospital", setDoctorHospitalData);
  }, []);

  useEffect(() => {
    const filteredData = doctorHospitalData.filter((data) =>
      data.hospitalDays.some(
        (hospitalDay) =>
          hospitalDay.doctorId === uid &&
          hospitalDay.day.toLowerCase() === dayName.toLowerCase()
      )
    );
    setFilteredDoctorHospitalData(filteredData);
  }, [doctorHospitalData]);

  const updateStatusToInProgress = async (sessionId, uid) => {
    try {
      const appointmentRef = query(
        collection(db, `appointments/${uid}/appointments`),
        where("sessionId", "==", sessionId)
      );

      const querySnapshot = await getDocs(appointmentRef);

      querySnapshot.forEach(async (docSnapshot) => {
        const appointmentDocRef = docSnapshot.ref;
        await updateDoc(appointmentDocRef, {
          status: "In Progress",
        });
      });

      alert("Successfully joined the appointment!");
    } catch (error) {
      alert("Error joining the appointment: ${error.message}");
    }
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const recivedDateRef = collection(
          firestore,
          "recivedDate",
          uid,
          "recivedDate"
        );

        const date = new Date();
        const options = { weekday: "long" };

        const q = query(
          recivedDateRef,
          where("doctor", "==", uid),
          where("SheduledDate", "==", date.toDateString())
        );

        const querySnapshot = await getDocs(q);
        const bookedSlots = querySnapshot.docs.map((doc) => doc.data().time);

        const filteredData = doctorHospitalData
          .map((data) => {
            const relevantHospitalDays = data.hospitalDays.filter(
              (hospitalDay) =>
                hospitalDay.day === date.toLocaleDateString("en-US", options)
            );

            if (relevantHospitalDays.length > 0) {
              return {
                ...data,
                hospitalDays: relevantHospitalDays,
              };
            }
            return null;
          })
          .filter((data) => data !== null);

        setBookedDate(bookedSlots);
      } catch (error) {
        console.error("Error fetching booked slots: ", error);
      }
    };

    fetchBookedSlots();
  }, [doctorHospitalData, uid]);

  const [doctorData, setDoctorData] = useState([]);
  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  const DoctorDoc = Object.values(doctorData).find((doc) => doc.dataId === uid);

  const handleSelectionTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <div className="w-full h-screen flex  justify-end">
      <div className="h-screen w-5/6 mt-20 px-10">
        <div className="w-full ">
          {dateFilteredAppointments.length > 0 ? (
            dateFilteredAppointments
              ?.slice(0, 1)
              .map(
                ({ Date, time, userId, docId, dataId, status, id }, index) => {
                  const patient = Object.values(patientData).find(
                    (doc) => doc.dataId === userId
                  );
                  return (
                    <div className="flex sticky top-24 items-center justify-between bg-primary px-10 py-5 rounded-3xl">
                      <div className="flex flex-row gap-5 items-center justify-center">
                        <img
                          className="w-[60px] h-[60px] rounded-full"
                          src={patient?.img || userImg}
                          alt="profileImage"
                        />
                        <div className="flex flex-col">
                          <p className="font-bold text-white text-[18px]">
                            {DoctorDoc?.name}
                          </p>
                          <p className="font-semibold  text-gray-400 text-[12px]">
                            {time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6 items-center justify-center ">
                        <Link to={"/doctor/home"}>
                          <button className="text-black px-14 py-2 text-[15px] bg-accent rounded-full ">
                            Cancel
                          </button>
                        </Link>
                        <Link to={`/doctor/application/${id}`}>
                          <button
                            onClick={() => updateStatusToInProgress(id, userId)}
                            className="text-white px-14 py-2 text-[15px] bg-lightblueButton rounded-full "
                          >
                            Start
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                }
              )
          ) : (
            <div className="flex sticky top-24 items-center justify-between bg-primary px-10 py-5 shadow-md rounded-3xl">
              <div className="flex flex-row gap-5 items-center justify-center">
                <img
                  className="w-[60px] h-[60px] rounded-full"
                  src={user?.img || userImg}
                  alt="profileImage"
                />
                <div className="flex flex-col">
                  <p className="font-bold text-white text-[18px]">
                    {DoctorDoc?.name}
                  </p>
                  <p className="font-semibold  text-gray-400 text-[12px]">
                    {DoctorDoc?.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-center justify-center ">
                <Link to={"/doctor/user"}>
                  <div className="flex  items-center gap-3 bg-lightblueButton rounded-full px-8 py-3">
                    <img src={editProfile} alt="uploadIcon" />
                    <p className="text-white text-[14px]">Edit Profile</p>
                  </div>
                </Link>
                <Link to={"/doctor/settings"}>
                  <div className="flex  items-center gap-3 bg-lightblueButton rounded-full px-8 py-3">
                    <img className="" src={settingsIcon} alt="settingsIcon" />
                    <p className="text-white text-[14px]">Settings</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        <section className="mt-10 flex">
          <div className="w-2/3 pr-5">
            <p className="text-[17px] font-medium">UpComming appoitment </p>

            <div className="p-5 flex flex-col gap-8 mt-5">
              {dateFilteredAppointments.length > 0 ? (
                dateFilteredAppointments?.map(
                  (
                    { Date, time, userId, docId, dataId, status, id },
                    index
                  ) => {
                    const patient = Object.values(patientData).find(
                      (doc) => doc.dataId === userId
                    );
                    return (
                      <div className="flex flex-col gap-3 px-10 py-6 border-2 rounded-3xl shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-[16px]"
                              src={calanderIcon}
                              alt=""
                            />
                            <p className="font-medium text-[14px]">{Date}</p>
                          </div>
                          <div className="w-fit relative">
                            <img
                              className="w-[25px]"
                              onClick={() => toggleDropdown(index)}
                              src={moreIcon}
                              alt=""
                            />
                            {openDropdown === index && (
                              <div className="absolute right-0 mt-0 bg-white border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col gap-3 items-start">
                                <button
                                  onClick={() => toggleDropdown(index)}
                                  className="w-56 bg-[#FF4141] text-white font-semibold text-[12px] rounded-full px-5 py-3 hover:scale-105"
                                >
                                  Cancel appointment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <img
                              className="w-[70px] h-[70px] rounded-full drop-shadow-lg"
                              src={patient?.img || userImg}
                              alt="profile"
                            />
                            <div className="flex flex-col gap-1">
                              <p className="font-semibold text-[17px]">
                                {patient?.name}
                              </p>
                              <p className="font-semibold text-[12px] text-gray-400">
                                {time}
                              </p>
                            </div>
                          </div>

                          <Link to={`/doctor/application/${id}`}>
                            <button
                              onClick={() =>
                                updateStatusToInProgress(id, userId)
                              }
                              className="px-10 py-2 text-[15px] bg-lightblueButton rounded-full text-white hover:scale-105"
                            >
                              join apointment
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="flex flex-col items-center justify-center w-full max-h-[200px] px-10 py-8 border-2 shadow-md rounded-3xl">
                  <img className="w-[120px]" src={noAppoinmentImg} alt="" />
                  <p className="text-[12px] font-semibold text-gray-400 ">
                    No Appoinment Found here
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="sticky top-40 right-0 w-1/4 flex flex-col gap-5 border-l pl-5">
            <p className="text-[17px] font-medium">Today</p>
            <p className="text-[15px] font-medium">Free Slots</p>
            <div className="w-full">
              {filteredDoctorHospitalData.length > 0 ? (
                filteredDoctorHospitalData.map((data, index) => (
                  <div key={index}>
                    {data.hospitalDays.map(
                      (hospitalDay, idx) =>
                        hospitalDay.doctorId === uid &&
                        hospitalDay.day.toLowerCase() === "tuesday" && (
                          <div key={idx} className="mt-2">
                            <div className="grid grid-cols-2 grid-flow-row gap-3">
                              {hospitalDay.availableTimeSlots.length > 0 ? (
                                hospitalDay.availableTimeSlots
                                  .filter((slot) => !bookedDate.includes(slot))
                                  .map((slot, slotIdx) => (
                                    <div
                                      key={slotIdx}
                                      onClick={() =>
                                        handleSelectionTimeSlot(slot)
                                      }
                                      className={`relative cursor-pointer border-2 shadow-xl flex items-center justify-center rounded-3xl ${
                                        selectedTimeSlot === slot
                                          ? "border-[#FF4141]"
                                          : "flex"
                                      }`}
                                    >
                                      <img
                                        className={`w-[25px] absolute -right-1 -bottom-2 ${
                                          selectedTimeSlot === slot
                                            ? "flex"
                                            : "hidden"
                                        }`}
                                        src={minusIcon}
                                        alt=""
                                      />
                                      <p className="px-5 py-3 font-semibold text-[12px] text-gray-500">
                                        {slot}
                                      </p>
                                    </div>
                                  ))
                              ) : (
                                <p>hi</p>
                              )}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ))
              ) : (
                <div className="flex w-full items-center justify-center border-2 rounded-3xl px-5 py-5 text-[13px] text-gray-400">
                  No free time slot today
                </div>
              )}
            </div>
            <div className="mt-5">
              <p className="text-[17px] font-medium">My Callander</p>
              <DateCalendar />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorHome;
