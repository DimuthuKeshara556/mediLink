import { useAuth } from "../../AuthContext/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorToggle from "../UserDashboard/DoctorList/DoctorToggle";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";
import DaysOfWeek from "./DaysOfWeek";
import db, { firestore } from "../../../Firebase/firebase";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const CreateAppoinmentPage = () => {
  const { uid } = useAuth();
  const { dataId } = useParams();
  const [doctorHospitalData, setDoctorHospitalData] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [filteredDoctorHospitalData, setFilteredDoctorHospitalData] = useState(
    []
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [bookedDate, setBookedDate] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const handleDateSelection = (date) => {
    setSelectedSchedule(date);
  };

  const handleSelection = (dataId, day) => {
    setSelectedHospital(dataId);
    setSelectedDay(day);
  };

  useEffect(() => {
    getDataFromCollection("hospital", setHospitalList);
  }, []);

  useEffect(() => {
    getDataFromCollection("doctorHospital", setDoctorHospitalData);
  }, []);

  const addData = async () => {
    try {
      const appointmentRef = collection(
        firestore,
        "appointments",
        uid,
        "appointments"
      );
      const appointmentDocRef = await addDoc(appointmentRef, {
        userId: uid,
        docId: dataId,
        timestamp: serverTimestamp(),
        SheduledDate: selectedSchedule,
        hospital: selectedHospital,
        time: selectedTimeSlot,
        status: "pending",
        sessionId: "",
        startTime: `${selectedSchedule} ${selectedTimeSlot}`,
      });

      const sessionRef = collection(firestore, "sessions");
      const sessionDocRef = await addDoc(sessionRef, {
        userId: uid,
        docId: dataId,
        Date: selectedSchedule,
        time: selectedTimeSlot,
        status: "pending",
        startTime: `${selectedSchedule} ${selectedTimeSlot}`,
      });

      const recivedDateRef = doc(
        firestore,
        "recivedDate",
        dataId,
        "recivedDate",
        sessionDocRef.id
      );

      await setDoc(recivedDateRef, {
        SheduledDate: selectedSchedule,
        hospital: selectedHospital,
        time: selectedTimeSlot,
        doctor: dataId,
      });

      await updateDoc(appointmentDocRef, {
        sessionId: sessionDocRef.id,
      });

      setAlert({ type: "success", message: "Well Done!" });
      setTimeout(() => navigate("/patient/appointment"), 2000);
    } catch (error) {
      setAlert({
        type: "warning",
        message: `Sorry! We can't process your appointment at this time. ${error.message}`,
      });
    }
  };

  const handleSelectionTimeSlot = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };
  const selectedDayOfWeek = new Date(selectedSchedule).toLocaleDateString(
    "en-US",
    { weekday: "long" }
  );

  const refetchData = () => {};

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const docRef = doc(db, "doctor", dataId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctorData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDoctorData();
  }, [dataId]);

  const fetchDoctorData = () => {
    getDataFromCollection("doctor", setDoctorData);
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const recivedDateRef = collection(
          firestore,
          "recivedDate",
          dataId,
          "recivedDate"
        );

        const q = query(
          recivedDateRef,
          where("doctor", "==", dataId),
          where("SheduledDate", "==", selectedSchedule)
        );

        const querySnapshot = await getDocs(q);
        const bookedSlots = querySnapshot.docs.map((doc) => doc.data().time);

        const filteredData = doctorHospitalData
          .map((data) => {
            const relevantHospitalDays = data.hospitalDays.filter(
              (hospitalDay) =>
                hospitalDay.day === selectedDayOfWeek &&
                hospitalDay.doctorId === dataId
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
        setFilteredDoctorHospitalData(filteredData);
      } catch (error) {
        console.error("Error fetching booked slots: ", error);
      }
    };

    fetchBookedSlots();
  }, [doctorHospitalData, selectedSchedule, selectedDayOfWeek, dataId]);

  useEffect(() => {
    if (selectedHospital && selectedTimeSlot) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [selectedHospital, selectedTimeSlot]);

  //  console.log(filteredDoctorHospitalData);

  return (
    <div className="w-full h-screen flex justify-center md:justify-end font-Inter">
      <div className="h-screen w-full md:w-5/6 mt-24 md:mt-32 px-5 md:px-20">
        {alert.message && (
          <Alert severity={alert.type}>
            <AlertTitle>
              {alert.type === "success" ? "Success" : "Sorry!"}
            </AlertTitle>
            {alert.message}
          </Alert>
        )}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] rounded-full shadow-lg "
              src={doctorData?.img}
              alt="doctorProfile"
            />
            <div>
              <p className="font-medium text-[14px] md:text-[17px]">
                {doctorData?.name}
              </p>
              <p className="font-medium text-[12px] md:text-[14px] text-gray-400">
                {doctorData?.speciality}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <DoctorToggle
              patientId={uid}
              doctorId={dataId}
              onToggle={refetchData}
            />
            <p className="text-[10px] md:text-[12px] font-semibold ">Add to</p>
            <p className="text-[10px] md:text-[12px] font-semibold ">
              Favourite
            </p>
          </div>
        </section>
        <p className="p-3 md:p-2 mt-5 mb-5 font-medium text-[12px] md:text-[14px] text-gray-400">
          {doctorData?.name} is a compassionate and skilled{" "}
          {doctorData?.speciality} committed to providing personalized care to
          every patient. With a deep understanding of individual needs,{" "}
          {doctorData?.name} creates tailored treatment plans to support your
          well-being. Book an appointment today to receive the specialized care
          you deserve.
        </p>

        <section>
          <p className="font-medium text-[14px] md:text-[17px] mt-5">
            Available Hospitals
          </p>

          <div className="flex gap-10 mb-10">
            {doctorHospitalData?.map((data, idx) => {
              const relevantHospitalDays = data.hospitalDays?.filter(
                (hospitalDay) => hospitalDay.doctorId === dataId
              );

              return relevantHospitalDays?.map((hospitalDay, hospitalIdx) => {
                const hospital = Object.values(hospitalList).find(
                  (doc) => doc.dataId === hospitalDay.hospitalId
                );

                return (
                  <div key={`${idx}-${hospitalIdx}`} className="mt-2">
                    <div
                      onClick={() =>
                        handleSelection(hospital?.dataId, hospitalDay?.day)
                      }
                      className={`w-fit mt-5 cursor-pointer p-4 border mb-2 rounded-3xl ${
                        selectedHospital === hospital?.dataId
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      <p className=" px-5 py-1 font-semibold text-[12px] md:text-[15px]">
                        {hospital?.name}
                      </p>
                    </div>
                  </div>
                );
              });
            })}
          </div>
          {/* {selectedHospital && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-md">
              <p>Selected Hospital Data ID: {selectedHospital}</p>
              <p>Selected Day: {selectedDay}</p>
            </div>
          )} */}
        </section>

        <section>
          <p className="font-medium text-[14px] md:text-[17px]">Schedule</p>
          <DaysOfWeek onDateSelect={handleDateSelection} day={selectedDay} />
          {/* {selectedSchedule && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-md">
              <h3 className="text-sm font-bold">Selected Date:</h3>
             
              <p>{selectedDayOfWeek}</p>
              <p>{selectedSchedule}</p>
            </div>
          )} */}
        </section>

        <section>
          <p className="font-medium text-[14px] md:text-[17px] mt-10">
            Available
          </p>
          {filteredDoctorHospitalData.length > 0 ? (
            filteredDoctorHospitalData.map((data, index) => (
              <div key={index}>
                {data.hospitalDays.map(
                  (hospitalDay, idx) =>
                    hospitalDay.day === selectedDayOfWeek && (
                      <div key={idx} className="mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-5 mt-5">
                          {hospitalDay.availableTimeSlots
                            .filter((slot) => !bookedDate.includes(slot))
                            .map((slot, slotIdx) => (
                              <div
                                key={slotIdx}
                                onClick={() => handleSelectionTimeSlot(slot)}
                                className={`cursor-pointer p-4 border rounded-3xl ${
                                  selectedTimeSlot === slot
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                <p className="px-2 md:px-5 py-1 font-semibold text-[12px] md:text-[15px]">
                                  {slot}
                                </p>
                              </div>
                            ))}
                        </div>
                        {/* {selectedTimeSlot && (
                        <p className="mt-4 p-4 bg-yellow-100 rounded-md">
                          Selected Time Slot: {selectedTimeSlot}
                        </p>
                      )} */}
                      </div>
                    )
                )}
              </div>
            ))
          ) : (
            <p className="text-[13px] md:text-[16px] mt-5 text-gray-400">
              No time slot available for the selected day.
            </p>
          )}
        </section>
        <section className="w-full items-center justify-center flex gap-10 mt-10">
          <button className="text-[13px] md:text-[16px] px-10 md:px-14 py-2 border-2 shadow-lg rounded-full hover:scale-105">
            Cancel
          </button>
          <button
            onClick={addData}
            disabled={isDisabled}
            className={`px-4 text-[13px] md:text-[16px]  md:px-10 py-2 rounded-full border-2 shadow-lg hover:scale-105 ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Book Appointment
          </button>
        </section>
        <section className="mt-20"> .</section>
      </div>
    </div>
  );
};

export default CreateAppoinmentPage;
