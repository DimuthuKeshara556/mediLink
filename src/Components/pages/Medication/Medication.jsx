import React, { useEffect, useState } from "react";
import UserDetailComponent from "../UserDashboard/UserDetailComponent/UserDetailComponent";
import medicationImg from "../../../assets/Images/medication.png";
import NotificationIcon from "../../../assets/Icons/notification.png";
import calanderIcon from "../../../assets/Icons/calander.svg";
import forwardIcon from "../../../assets/Icons/forword.svg";
import getDataFromSubCollection from "../../../Utils/dataFetch/getDataFromSubCollection";
import { useAuth } from "../../AuthContext/AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import db, { firestore } from "../../../Firebase/firebase";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";
import PdfComponent from "../Test/PdfComponent";

const Medication = () => {
  const [appoinmentData, setAppoinmentData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const { uid } = useAuth();
  const [validSessionData, setValidSessionData] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState({});
  const [medications, setMedications] = useState({});

  useEffect(() => {
    const fetchData = () => {
      getDataFromSubCollection(
        "appointments",
        uid,
        "appointments",
        setAppoinmentData
      );
    };
    fetchData();
  }, [uid]);

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  useEffect(() => {
    const fetchTreatmentPlans = async (sessionId) => {
      const userRef = doc(firestore, "treatmentPlans", sessionId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setTreatmentPlans((prevPlans) => ({
          ...prevPlans,
          [sessionId]: userDoc.data().plans || [],
        }));
      }
    };
    const fetchMedications = async (sessionId) => {
      const userMedicationRef = doc(firestore, "medications", sessionId);
      const userMedicationDoc = await getDoc(userMedicationRef);

      if (userMedicationDoc.exists()) {
        setMedications((prevMedi) => ({
          ...prevMedi,
          [sessionId]: userMedicationDoc.data().medications || [],
        }));
      }
    };

    if (appoinmentData) {
      appoinmentData.forEach(({ sessionId }) => {
        fetchTreatmentPlans(sessionId);
      });
      appoinmentData.forEach(({ sessionId }) => {
        fetchMedications(sessionId);
      });
    }
  }, [appoinmentData]);

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

      setValidSessionData(validSessions);
    };

    fetchSessions();
  }, [uid]);

  // console.log(validSessionData);

  return (
    <div className="w-full h-screen flex  justify-end font-Inter">
      <div className="h-screen w-full md:w-5/6 mt-24 md:mt-32 px-5 md:px-20">
        <UserDetailComponent />
        <section className="w-full">
          <p className="text-[14px] md:text-[17px]  font-medium mt-10">
            Treatment Plan
          </p>
          <div className="flex flex-col w-full gap-10">
            <div>
              {validSessionData?.map(({ id, docId, Date }, index) => {
                const doctor = Object.values(doctorData).find(
                  (doc) => doc.dataId === docId
                );

                const plans = treatmentPlans[id] || [];
                const Medications = medications[id] || [];

                const hasPlans = plans.length > 0;
                const hasMedications = Medications.length > 0;

                return (
                  <section key={index}>
                    <div
                      className={`w-full mt-5 md:mt-10 px-5 md:px-10 py-8 border-2 shadow-md rounded-3xl  ${
                        hasPlans || hasMedications ? "flex flex-col" : "hidden"
                      }`}
                    >
                      <div
                        className={`flex flex-col-reverse md:flex-row items-start justify-between`}
                      >
                        <div className="w-full flex flex-row gap-3 md:gap-5 ">
                          <img
                            className="w-[50px] h-[50px] rounded-full"
                            src={doctor?.img}
                            alt="profileImage"
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold text-[14px] md:text-[16px]">
                              {doctor?.name}
                            </p>
                            <p className="font-semibold text-[12px] text-gray-400">
                              {doctor?.speciality}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-end gap-2 md:gap-4 mb-3 md:mb-0">
                          <img
                            className="w-[14px] md:w-[16px]"
                            src={calanderIcon}
                            alt="calanderIcon"
                          />
                          <p className="font-medium text-[11px] md:text-[14px]">
                            {Date}
                          </p>
                        </div>
                      </div>

                      {hasPlans && (
                        <div className="w-full">
                          <ol className="list-decimal list-inside mt-5 space-y-2 text-[13px] md:text-[16px] font-medium md:px-20">
                            {plans.map((plan, planIndex) => (
                              <div key={planIndex}>
                                <li className="text-[14px] md:text-[16px]">
                                  {plan.heading}
                                </li>
                                <ul>
                                  <li className=" font-normal text-gray-500">
                                    {plan.content}
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>

                    {hasMedications && (
                      <div className="w-full">
                        <section className="mt-10 w-full">
                          <p className="text-[14px] md:text-[17px] font-medium mt-10">
                            Medications
                          </p>
                          <div className="w-full flex items-center mt-10">
                            <div className="flex flex-col w-full gap-5 border-2 shadow-lg py-8 px-5 md:px-10 rounded-3xl items-center">
                              <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between">
                                <div className="w-full md:w-fit flex flex-row items-center gap-3 md:gap-5">
                                  <img
                                    className="w-[50px] h-[50px] rounded-full"
                                    src={doctor?.img}
                                    alt="profileImage"
                                  />
                                  <div className="flex flex-col">
                                    <p className=" text-[14px] md:text-[17px] font-semibold">
                                      {doctor?.name}
                                    </p>
                                    <p className="font-semibold text-[12px] text-gray-400">
                                      {doctor?.speciality}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full md:w-fit  flex flex-col items-end mb-3 md:mb-0 ">
                                  <div className="flex w-full items-center justify-end gap-2 md:gap-4 mb-1 md:mb-0">
                                    <img
                                      className="w-[14px] md:w-[16px]"
                                      src={calanderIcon}
                                      alt="calanderIcon"
                                    />
                                    <p className="font-medium text-[11px] md:text-[14px]">
                                      {Date}
                                    </p>
                                  </div>
                                  <p className="text-[10px] font-bold text-lightblueButton">
                                    Available {medications.availableDaye} days
                                    left
                                  </p>
                                </div>
                              </div>

                              <section className="flex w-full gap-5">
                                <img
                                  className="hidden md:flex w-1/4 border-r-2"
                                  src={medicationImg}
                                  alt="medicationImg"
                                />
                                <div className="w-full flex flex-col items-center">
                                  {Medications.map(
                                    (medication, medicationIndex) => (
                                      <div
                                        key={medicationIndex}
                                        className="w-full"
                                      >
                                        <div className="w-full py-3 border-b-2 grid grid-cols-5 text-[13px] font-semibold">
                                          <div className="w-[12px] h-[12px] md:w-[20px] md:h-[20px] text-[13px] rounded-full bg-lightblueButton"></div>
                                          <p>{medication.medicationName}</p>
                                          <p>
                                            {medication.dosage}
                                            <span className="pl-2">
                                              {medication.unit}
                                            </span>
                                          </p>
                                          <p>&#215; {medication.frequency}</p>
                                          <p>{medication.whenToTake}</p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </section>

                              <section className="w-full flex flex-col md:flex-row gap-5 md:gap-0">
                                <div className="w-full md:w-4/5 text-[10px] font-medium text-rose-800 pr-5">
                                  <p>Caution:</p>
                                  <ul>
                                    <li>
                                      If you are a child, seek help from a
                                      parent or guardian before taking
                                      medication, and always follow the
                                      prescribed dosage, consulting a healthcare
                                      professional if needed.
                                    </li>
                                    <li>
                                      Take your medication exactly as
                                      prescribed, following the correct dosage
                                      and timing; consult your healthcare
                                      professional with any questions.
                                    </li>
                                  </ul>
                                </div>
                                <div className="w-full md:w-1/5 flex items-end md:items-center md:justify-between justify-end gap-6 md:gap-0">
                                  <img
                                    className="bg-lightblue w-[40px] p-2 rounded-full hover:scale-105"
                                    src={NotificationIcon}
                                    alt="Notification"
                                  />
                                  <div className="bg-lightblue w-[40px] p-2 rounded-full hover:scale-105">
                                    <PdfComponent sessionId={id} />
                                  </div>
                                  <img
                                    className="bg-lightblue w-[40px] p-2 rounded-full hover:scale-105"
                                    src={forwardIcon}
                                    alt="forward"
                                  />
                                </div>
                              </section>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </div>
        </section>
        <section className="mt-20 md:mt-6"> .</section>
      </div>
    </div>
  );
};

export default Medication;
