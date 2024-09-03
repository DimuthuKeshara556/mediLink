import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../../../Firebase/firebase";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";
import { useAuth } from "../../../AuthContext/AuthContext";
import { calculateTimeSlots } from "../DoctorDetailePage/timeUtils";

const Settings = () => {
  const { uid } = useAuth();
  const [hospitalDays, setHospitalDays] = useState([
    {
      doctorId: uid,
      hospitalId: "",
      day: "",
      startTime: "",
      endTime: "",
      availableTimeSlots: [],
    },
  ]);
  const [hospitalData, setHospitalData] = useState([]);

  const handleChange = (index, field, value) => {
    const newHospitalDays = [...hospitalDays];
    newHospitalDays[index][field] = value;
    if (field === "startTime" || field === "endTime") {
      const startTime = newHospitalDays[index].startTime;
      const endTime = newHospitalDays[index].endTime;
      newHospitalDays[index].availableTimeSlots = calculateTimeSlots(
        startTime,
        endTime
      );
    }
    setHospitalDays(newHospitalDays);
  };

  const addHospitalDay = () => {
    setHospitalDays([
      ...hospitalDays,
      {
        doctorId: uid,
        hospitalId: "",
        day: "",
        startTime: "",
        endTime: "",
        availableTimeSlots: [],
      },
    ]);
  };

  useEffect(() => {
    getDataFromCollection("hospital", setHospitalData);
  }, []);

  useEffect(() => {
    getDataFromCollection("hospital", setHospitalData);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "doctorHospital"), {
        doctorId: uid,
        hospitalDays,
      });
      alert("Data added successfully!");
      setHospitalDays([
        {
          doctorId: uid,
          hospitalId: "",
          day: "",
          startTime: "",
          endTime: "",
          availableTimeSlots: [],
        },
      ]);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding data");
    }
  };

  return (
    <div className="w-full h-screen flex justify-end font-Inter">
      <div className="h-screen w-5/6 mt-32 px-20 flex flex-col gap-10">
        <div>
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto mt-8 p-4 border rounded shadow-lg"
          >
            {hospitalDays.map((hospitalDay, index) => (
              <div key={index} className="mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Hospital
                  </label>
                  <select
                    value={hospitalDay.hospitalId}
                    onChange={(e) =>
                      handleChange(index, "hospitalId", e.target.value)
                    }
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    {hospitalData.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Day
                  </label>
                  <select
                    value={hospitalDay.day}
                    onChange={(e) => handleChange(index, "day", e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={hospitalDay.startTime}
                    onChange={(e) =>
                      handleChange(index, "startTime", e.target.value)
                    }
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={hospitalDay.endTime}
                    onChange={(e) =>
                      handleChange(index, "endTime", e.target.value)
                    }
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHospitalDay}
              className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-lightblueButton hover:scale-105"
            >
              Add Another Hospital Day
            </button>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-lightblueButton  hover:scale-105 "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
