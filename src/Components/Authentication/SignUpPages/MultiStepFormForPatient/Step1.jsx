import React from "react";
import { Link } from "react-router-dom";

const Step1 = ({ nextStep, handleChange, values }) => {
  return (
    <div className="flex relative h-[75vh] flex-col justify-center gap-4 bg-gray-200 px-10 py-10 rounded-3xl">
      <label className="flex flex-col gap-2 text-[14px] font-medium">
        Full Name
        <input
          className="py-2 px-5 rounded-3xl text-[12px] "
          type="text"
          name="name"
          placeholder="Type your full name "
          value={values.name}
          onChange={handleChange}
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-[14px] font-medium">
        Phone Number
        <input
          className="py-2 px-5 rounded-3xl text-[12px]"
          type="tel"
          name="phoneNumber"
          placeholder="+94 000-000-000"
          value={values.phoneNumber}
          onChange={handleChange}
        />
      </label>
      <label className="flex flex-col gap-2 text-[14px] font-medium">
        Address
        <input
          className="py-2 px-5 rounded-3xl text-[12px]"
          type="text"
          name="address"
          placeholder="Type your  address"
          value={values.address}
          onChange={handleChange}
        />
      </label>

      <div className="flex w-full items-center justify-between gap-5 mb-20">
        <label className="w-full flex flex-col gap-2 text-[14px] font-medium">
          Date of Birth
          <input
            className="py-2 px-5 rounded-3xl text-[12px]"
            type="date"
            name="dob"
            value={values.dob}
            onChange={handleChange}
          />
        </label>
        <label className="w-full flex flex-col gap-2 text-[14px] font-medium">
          Gender
          <select
            className="py-2 px-5 rounded-3xl text-[12px]"
            name="gender"
            value={values.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select gender type
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div className="w-full absolute left-0 bottom-0 px-10 py-5">
        <div className="w-full flex items-center justify-between  text-[13px] font-semibold mt-4 ">
          <Link to={"/"}>
            <button className="px-10 py-2 border border-gray-800 rounded-full hover:scale-105">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="px-10 py-2 border bg-lightblueButton rounded-full text-white hover:scale-105"
            onClick={nextStep}
          >
            Next
          </button>
        </div>
        <p className="text-[12px] font-medium mt-4">
          Already a member?{" "}
          <Link to={"/login"}>
            <span className="font-bold text-lightblueButton">LogIn</span>
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Step1;
