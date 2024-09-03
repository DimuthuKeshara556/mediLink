import React from "react";

const DoctorStep2 = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <div className="flex relative h-[75vh] flex-col justify-center gap-4 bg-gray-200 px-10 py-10 rounded-3xl">
      <label className="flex flex-col gap-2">
        Medical License Number
        <input
          className="py-2 px-5 rounded-3xl text-[12px]"
          type="text"
          name="MedicalLicenseNumber"
          placeholder="Type your medical license number"
          value={values.medicalLicenseNumber}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-col gap-2 mb-20">
        Speciality
        <input
          className="py-2 px-5 rounded-3xl text-[12px]"
          type="text"
          name="Speciality"
          placeholder="Type your Speciality"
          value={values.speciality}
          onChange={handleChange}
        />
      </label>

      <div className="w-full absolute left-0 bottom-14 px-10">
        <div className="w-full flex items-center justify-between  text-[13px] font-semibold mt-4 ">
          <button
            className="px-10 py-2 border border-gray-800 rounded-full hover:scale-105"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className="px-10 py-2 border bg-lightblueButton rounded-full text-white hover:scale-105"
            onClick={nextStep}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorStep2;
