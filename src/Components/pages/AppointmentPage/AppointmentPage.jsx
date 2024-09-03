import calanderIcon from "../../../assets/Icons/calander.svg";
import moreIcon from "../../../assets/Icons/more.svg";
import rescheduleIcon from "../../../assets/Icons/Reschedule.svg";
import noAppoinmentImg from "../../../assets/Images/no Appoinment.png";
import deleteIcon from "../../../assets/Icons/delete.svg";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext/AuthContext";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";
import db, { firestore } from "../../../Firebase/firebase";
import UserDetailComponent from "../UserDashboard/UserDetailComponent/UserDetailComponent";
import { deleteDoc, doc } from "firebase/firestore";
import ReportComponent from "../ReportComponent/ReportComponent";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const AppointmentPage = () => {
  let dateFilteredAppointments;
  const { uid } = useAuth();
  const [doctorData, setDoctorData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [sortAppointments, setSortAppointments] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleClickReshedule = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  const getSortedAppointments = async () => {
    try {
      const appointmentRef = collection(
        firestore,
        "appointments",
        uid,
        "appointments"
      );
      const q = query(appointmentRef, orderBy("startTime"));

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

  const fetchAppointments = async () => {
    const data = await getSortedAppointments();
    setSortAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, [uid]);

  if (sortAppointments?.some(({ status }) => status === "In Progress")) {
    dateFilteredAppointments = sortAppointments
      ?.filter(({ status }) => status === "In Progress")
      .sort();
  } else {
    dateFilteredAppointments = sortAppointments
      ?.filter(({ status }) => status === "pending")
      .sort();
  }

  const handleDeleteAppointment = async (id, sessionId, doctorId) => {
    try {
      const appointmentDoc = doc(db, "appointments", uid, "appointments", id);
      await deleteDoc(appointmentDoc);
      const sessionDoc = doc(db, "sessions", sessionId);
      await deleteDoc(sessionDoc);
      const recivedDateDoc = doc(
        db,
        "recivedDate",
        doctorId,
        "recivedDate",
        sessionId
      );
      await deleteDoc(recivedDateDoc);
      fetchAppointments();
      setIsDropdownOpen(!isDropdownOpen);
      setAlert({ type: "success", message: "Well Done!", open: true });
    } catch (error) {
      setAlert({
        type: "warning",
        message: `Sorry! We can't process your appointment at this time. ${error.message}`,
        open: true,
      });
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center md:justify-end font-Inter">
      <div className="h-screen w-full md:w-5/6 mt-24  px-5 md:px-20">
        <UserDetailComponent />
        <section className="flex w-full items-center gap-10 mt-10">
          <div className="w-full md:w-2/3 ">
            <p className="font-medium text-[14px] md:text-[17px]">
              UpComming appoitment{" "}
            </p>

            {dateFilteredAppointments?.length > 0 ? (
              dateFilteredAppointments
                ?.slice(0, 1)
                .map(
                  (
                    { SheduledDate, time, docId, sessionId, status, id },
                    index
                  ) => {
                    const doctor = Object.values(doctorData).find(
                      (doc) => doc.dataId === docId
                    );
                    return (
                      <div className="flex flex-col gap-5 px-5 md:px-10 py-4 border-2 rounded-3xl mt-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-5">
                            <img
                              className="w-[14px] md:w-[16px]"
                              src={calanderIcon}
                              alt=""
                            />
                            <p className="font-medium text-[11px] md:text-[14px]">
                              {SheduledDate}
                              <span className="text-gray-400 ml-2">{time}</span>
                            </p>
                          </div>
                          {status === "pending" ? (
                            <div className="w-fit relative">
                              <img
                                className="w-[20px] md:w-[25px]"
                                onClick={toggleDropdown}
                                src={moreIcon}
                                alt=""
                              />
                              {isDropdownOpen && (
                                <div className="absolute right-0 mt-0 bg-white border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col gap-3 items-start">
                                  <button
                                    onClick={() =>
                                      handleDeleteAppointment(
                                        id,
                                        sessionId,
                                        docId
                                      )
                                    }
                                    className="w-56 bg-[#FF4141] text-white font-semibold text-[12px] rounded-full px-5 py-3 hover:scale-105"
                                  >
                                    Cancel appointment
                                  </button>
                                  <Link to={`/patient/reschedule/${id}`}>
                                    <button
                                      onClick={handleClickReshedule}
                                      className="w-56 bg-lightblueButton text-white text-[12px] rounded-full px-5 py-3 font-semibold hover:scale-105"
                                    >
                                      ReSchedule appoitment
                                    </button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="font-bold text-[10px] md:text-[12px] text-white bg-green-500 px-2 md:px-5 py-1 rounded-full animate-blink">
                              On Going
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-row gap-3 md:gap-5 items-center">
                            <img
                              className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full drop-shadow-lg"
                              src={doctor?.img}
                              alt="profileImage"
                            />
                            <div className="flex flex-col">
                              <p className="font-semibold text-[13px] md:text-[17px]">
                                {doctor?.name}
                              </p>
                              <p className="font-semibold text-[10px] md:text-[12px]">
                                {doctor?.speciality}
                              </p>
                            </div>
                          </div>
                          <Link to={`/patient/active/${sessionId}`}>
                            <button className="px-3 md:px-6 py-2 text-[10px] md:text-[15px] bg-lightblueButton rounded-full text-white hover:scale-105">
                              Join appointment
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )
            ) : (
              <div className="flex flex-col items-center justify-center w-full max-h-[200px] px-10 py-8 border-2 rounded-3xl mt-5">
                <img className="w-[120px]" src={noAppoinmentImg} alt="" />
                <p className="text-[12px] font-semibold text-gray-400 ">
                  No Appoinment Found here
                </p>
                <Link to={"/patient/doctorlist"}>
                  <p className="text-[12px] font-semibold text-lightblueButton hover:scale-105 ">
                    Please create a new appoinment
                  </p>
                </Link>
              </div>
            )}
          </div>
        </section>
        {sortAppointments &&
          sortAppointments.filter(
            ({ status }) => status === "In Progress" || status === "pending"
          ).length > 0 && (
            <section className="w-full">
              <p className="text-[14px] md:text-[17px] font-medium mt-10">
                Other appointment
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {sortAppointments
                  ?.filter(
                    ({ status }) =>
                      status === "In Progress" || status === "pending"
                  )
                  .map(
                    (
                      { SheduledDate, time, docId, status, sessionId, id },
                      index
                    ) => {
                      const doctor = Object.values(doctorData).find(
                        (doc) => doc.dataId === docId
                      );
                      return (
                        <div
                          key={index}
                          className="w-full px-5 md:px-10 py-5 md:py-8 border-2 rounded-3xl"
                        >
                          <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-5">
                              <img
                                className="w-[14px] md:w-[16px]"
                                src={calanderIcon}
                                alt=""
                              />
                              <p className="font-medium text-[11px] md:text-[14px]">
                                {SheduledDate}
                                <span className="text-gray-400 ml-2">
                                  {time}
                                </span>
                              </p>
                            </div>
                            {status === "In Progress" ? (
                              <p className="font-bold text-[10px] md:text-[12px] text-white bg-green-500 px-2 md:px-5 py-1 rounded-full animate-blink">
                                On Going
                              </p>
                            ) : status === "complete" ? (
                              <p className="font-bold text-[10px] md:text-[12px] text-white bg-red-500 px-2 md:px-5 py-1 rounded-full">
                                Complete
                              </p>
                            ) : (
                              <p></p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-5">
                            <div className="flex flex-row gap-3  md:gap-5 items-center ">
                              <img
                                className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full drop-shadow-lg"
                                src={doctor?.img}
                                alt="profileImage"
                              />
                              <div className="flex flex-col">
                                <p className="font-semibold text-[13px] md:text-[17px]">
                                  {doctor?.name}
                                </p>
                                <p className="font-semibold text-[10px] md:text-[12px]">
                                  {doctor?.speciality}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex gap-3 md:gap-5 ${
                                status === "In Progress" ? "hidden" : "flex"
                              }`}
                            >
                              <img
                                onClick={() =>
                                  handleDeleteAppointment(id, sessionId, docId)
                                }
                                className="bg-accent w-[40px] rounded-full p-2 hover:scale-105 hover:bg-red-200"
                                src={deleteIcon}
                                alt=""
                              />
                              <Link to={`/patient/reschedule/${id}`}>
                                <img
                                  className="bg-accent w-[40px] rounded-full p-2 hover:scale-105 hover:bg-blue-200"
                                  src={rescheduleIcon}
                                  alt=""
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </section>
          )}

        <section className="mt-10">
          <ReportComponent />
        </section>
        <section className="mt-20 md:mt-6"> .</section>
      </div>
    </div>
  );
};

export default AppointmentPage;
