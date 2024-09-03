import calanderIcon from "../../assets/Icons/calander.svg";
import moreIcon from "../../assets/Icons/more.svg";
import viewAllIcon from "../../assets/Icons/DocIcon/viewAllButton.svg";
import noAppoinmentImg from "../../assets/Images/no Appoinment.png";
import forwordIcon from "../../assets/Icons/forword.svg";
import db, { auth, firestore } from "../../Firebase/firebase";
import { collection, getDoc, getDocs, where } from "firebase/firestore";
import UserDetailComponent from "../pages/UserDashboard/UserDetailComponent/UserDetailComponent";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { query, orderBy } from "firebase/firestore";
import rescheduleIcon from "../../assets/Icons/Reschedule.svg";
import deleteIcon from "../../assets/Icons/delete.svg";
import { useEffect, useState } from "react";
import getDataFromCollection from "../../Utils/dataFetch/getDataFromCollection";
import { deleteDoc, doc } from "firebase/firestore";
import ReportComponent from "../pages/ReportComponent/ReportComponent";
import PdfComponent from "../pages/Test/PdfComponent";

const UserDashBoard = () => {
  let dateFilteredAppointments;
  const [uid, setUid] = useState(null);
  const [treatmentPlans, setTreatmentPlans] = useState({});
  const [sessionData, setSessionData] = useState([]);
  const [sortAppointments, setSortAppointments] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickReshedule = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        console.log("user is logged out");
      }
    });
  }, []);

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, [uid]);

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
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    getDataFromCollection("treatmentPlans", setTreatmentPlans);
  }, [uid]);

  useEffect(() => {
    const fetchSessions = async () => {
      const sessionQuery = query(
        collection(db, "sessions"),
        where("status", "==", "complete"),
        where("userId", "==", uid)
      );
      const sessionSnapshot = await getDocs(sessionQuery);

      const filteredSessions = await Promise.all(
        sessionSnapshot.docs.map(async (sessionDoc) => {
          const sessionId = sessionDoc.id;

          const treatmentPlanDoc = await getDoc(
            doc(db, `treatmentPlans/${sessionId}`)
          );

          if (treatmentPlanDoc.exists()) {
            return {
              id: sessionDoc.id,
              ...sessionDoc.data(),
            };
          } else {
            return null;
          }
        })
      );

      const validSessions = filteredSessions.filter(
        (session) => session !== null
      );

      setSessionData(validSessions);
    };

    fetchSessions();
  }, [uid]);

  return (
    <div className="w-full h-screen flex justify-center md:justify-end ">
      <div className="h-screen w-full md:w-5/6 mt-24  px-5 md:px-20">
        <UserDetailComponent />
        <section className="flex flex-col md:flex-row w-full items-start gap-10 mt-8 md:mt-10">
          <div className="w-full md:w-2/3 ">
            <p className="text-[14px] md:text-[17px] font-medium">
              UpComming appoitment{" "}
            </p>

            {dateFilteredAppointments?.length > 0 ? (
              dateFilteredAppointments
                ?.sort()
                .slice(0, 1)
                .map(
                  (
                    {
                      SheduledDate,
                      time,
                      hospital,
                      docId,
                      sessionId,
                      status,
                      id,
                    },
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
                                <div className="z-50 absolute right-0 mt-0 bg-white border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col gap-3 items-start">
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
          <div className="w-full md:w-1/3">
            <p className="text-[14px] md:text-[17px] font-medium">
              Recent Medications{" "}
            </p>
            <div>
              {sessionData.length > 0 ? (
                sessionData
                  ?.filter(({ status }) => status === "complete")
                  .sort()
                  .splice(0, 1)
                  .map(({ docId, id, Date }, index) => {
                    const doctor = Object.values(doctorData).find(
                      (doc) => doc.dataId === docId
                    );
                    const treatmentPlan = Object.values(treatmentPlans).find(
                      (doc) => doc.dataId === id
                    );

                    return (
                      <>
                        {treatmentPlan.plans && treatmentPlan.plans[0] ? (
                          <div className="flex flex-col gap-3 px-8 py-5 border-2 rounded-3xl mt-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 md:gap-3">
                                <img
                                  className="w-[14px] md:w-[16px]"
                                  src={calanderIcon}
                                  alt="Calendar Icon"
                                />
                                <p className="font-medium text-[11px] md:text-[14px]">
                                  {Date}
                                </p>
                              </div>
                              <Link to="/patient/medication">
                                <p className="text-lightblueButton font-semibold text-[12px]">
                                  View All
                                </p>
                              </Link>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex flex-col">
                                <p className="font-medium text-[14px] md:text-[16px]">
                                  {doctor?.name}
                                </p>
                                <p className="font-medium text-[12px] md:text-[14px]">
                                  Type: Depression
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <PdfComponent sessionId={id} />

                                <img src={forwordIcon} alt="Forward Icon" />
                              </div>
                            </div>

                            <p className="font-normal text-[12px] md:text-[14px] text-gray-500 mt-1 md:mt-3">
                              Summary:{" "}
                              <span className="font-normal text-gray-500">
                                {treatmentPlan.plans[0].content}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-[200px] px-10 py-8 border-2 rounded-3xl mt-5">
                            <p className="text-[12px] font-semibold text-gray-400">
                              No Medication Found Here
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-[200px] px-10 py-8 border-2 rounded-3xl mt-5">
                  <p className="text-[12px] font-semibold text-gray-400">
                    No Medication Found Here
                  </p>
                </div>
              )}
            </div>
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
                          className="w-full px-5 md:px-10 py-8 border-2 rounded-3xl"
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
                              <p className="font-bold  text-[10px] md:text-[12px] text-white bg-green-500 px-2 md:px-5 py-1 rounded-full animate-blink">
                                On Going
                              </p>
                            ) : status === "complete" ? (
                              <p className="font-bold  text-[10px] md:text-[12px] text-white bg-red-500 px-2 md:px-5 py-1 rounded-full">
                                Complete
                              </p>
                            ) : (
                              <p></p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-5">
                            <div className="flex flex-row gap-3   md:gap-5 items-center ">
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

        {sessionData.length > 0 ? (
          <section className="w-full">
            <p className="text-[14px] md:text-[17px] font-medium mt-10">
              Medical Records
            </p>
            <div className="flex w-full gap-10 mt-10 items-center justify-center">
              <div className="w-full">
                {sessionData.length > 0 ? (
                  sessionData
                    ?.filter(({ status }) => status === "complete")
                    .sort()
                    .splice(0, 1)
                    .map(({ docId, id, Date, time }, index) => {
                      const doctor = Object.values(doctorData).find(
                        (doc) => doc.dataId === docId
                      );
                      const treatmentPlan = Object.values(treatmentPlans).find(
                        (doc) => doc.dataId === id
                      );

                      return (
                        <>
                          {treatmentPlan.plans && treatmentPlan.plans[0] ? (
                            <div className="flex gap-8">
                              <div className="w-full px-5 md:px-10 py-8 border-2 shadow-md rounded-3xl">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 md:gap-5">
                                    <img
                                      className="w-[14px] md:w-[16px]"
                                      src={calanderIcon}
                                      alt=""
                                    />
                                    <p className="font-medium text-[11px] md:text-[14px]">
                                      {Date}
                                      <span className="text-gray-400 ml-2">
                                        {time}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-10">
                                    {/* <img
                                    className="w-[20px] md:w-[25px]"
                                    src={moreIcon}
                                    alt=""
                                  /> */}
                                  </div>
                                </div>
                                <div className="w-full flex flex-col md:flex-row mt-5 gap-8 md:items-center md:justify-center">
                                  <div className="w-full md:w-2/5 flex flex-row gap-5">
                                    <img
                                      className="w-[50px] h-[50px] rounded-full"
                                      src={doctor?.img}
                                      alt="profileImage"
                                    />
                                    <div className="flex flex-col gap-1">
                                      <p className="font-semibold text-[14px] md:text-[16px]">
                                        Dr.{doctor?.name}
                                      </p>
                                      <p className="font-semibold text-[11px] md:text-[12px]">
                                        {doctor?.speciality}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-full md:w-3/5 flex flex-col gap-2">
                                    <p className="text-[13px] md:text-[15px] font-medium">
                                      Plan :{" "}
                                      <span className="font-normal text-gray-500">
                                        {treatmentPlan.plans[0].heading}
                                      </span>
                                    </p>
                                    <p className="text-[13px] md:text-[15px] font-medium">
                                      Summary :{" "}
                                      <span className="font-normal text-gray-500">
                                        {treatmentPlan.plans[0].content}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-center">
                                <Link to="/patient/medication">
                                  <div className="flex w-fit flex-col items-center justify-center gap-1">
                                    <img
                                      className="w-[20px] md:w-[25px] bg-lightblueButton p-1 rounded-full"
                                      src={viewAllIcon}
                                      alt=""
                                    />
                                    <p className="text-[12px] text-lightblueButton font-semibold">
                                      View_All
                                    </p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-[200px] px-10 py-8 border-2 rounded-3xl mt-5">
                              <p className="text-[12px] font-semibold text-gray-400">
                                No Medication Found Here
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-[200px] px-10 py-8 border-2 rounded-3xl mt-5">
                    <p className="text-[12px] font-semibold text-gray-400">
                      No Medication Found Here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <ReportComponent />
        </section>
        <section className="mt-20 md:mt-6"> .</section>
      </div>
    </div>
  );
};

export default UserDashBoard;
