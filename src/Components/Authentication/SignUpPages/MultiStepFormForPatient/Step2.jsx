import React from "react";

const Step2 = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <div className="flex relative h-[75vh] flex-col justify-center gap-4 bg-gray-200 px-10 py-10 rounded-3xl">
      <label className="flex flex-col gap-2">
        Blood Group <span className="text-gray-600">(optional)</span>
        <select
          className="py-2 px-5 rounded-3xl text-[12px]"
          name="bloodGroup"
          value={values.bloodGroup}
          onChange={handleChange}
        >
          <option value="" disabled>
            Choose your blood group
          </option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </label>

      <br />
      <label className="flex flex-col gap-2">
        Upload Your Previous Medical Records
      </label>
      <br />

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

export default Step2;
