import React from "react";

const Step3 = ({ nextStep, prevStep, handleChange, values, onSubmit }) => {
  return (
    <div className="flex relative h-[75vh] flex-col justify-center gap-4 bg-gray-200 px-10 py-10 rounded-3xl">
      <div className="mb-20">
        <label className="flex flex-col gap-2">
          Email
          <input
            className="py-2 px-5 rounded-3xl text-[12px]"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex flex-col gap-2">
            Password
            <input
              className="py-2 px-5 rounded-3xl text-[12px]"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col gap-2">
            Confirm Password
            <input
              className="py-2 px-5 rounded-3xl text-[12px]"
              type="password"
              name="confirmpassword"
              // value={values.password}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

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
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
