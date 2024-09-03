import React from "react";
import { Link } from "react-router-dom";

const QuickLinkSection = () => {
  return (
    <div className="w-full mt-24 md:mt-0 md:h-screen flex flex-col items-start justify-center px-10 gap-10">
      <p className="font-black text-[30px]">
        Connect to
        <br />
        Better Treatment
      </p>
      <div className="flex flex-col md:flex-row h-fit w-full gap-5 md:gap-0  md:justify-around">
        <div className="bg-accent w-full md:w-1/4 md:h-[300px] px-7 py-14 md:py-7 rounded-3xl flex flex-col items-center justify-center text-center md:text-start md:justify-end md:items-start drop-shadow-md hover:scale-105">
          <p className="font-bold text-[20px]">Find Best Doctor</p>
          <p className="text-[15px] py-4">
            Effortlessly locate top-rated doctors and book appointments with
            confidence on MediLink.
          </p>
          <Link to={"/patient/doctorlist"}>
            <button className="font-semibold bg-secondary text-[12px] text-white px-10 py-2 rounded-full">
              Find Your Doctor Now
            </button>
          </Link>
        </div>
        <div className="bg-accent w-full md:w-1/4 md:h-[300px] px-7 py-14 md:py-7 rounded-3xl flex flex-col items-center justify-center text-center md:text-start md:justify-end md:items-start drop-shadow-md hover:scale-105">
          <p className="font-bold text-[20px]">Make An Appoinment</p>
          <p className="text-[15px] py-4">
            Quickly book appointments with trusted healthcare professionals,
            anytime, anywhere, using MediLink.
          </p>
          <Link to={"/patient/appointment"}>
            <button className="font-semibold bg-secondary text-[12px] text-white px-10 py-2 rounded-full">
              Book Your Appointment
            </button>
          </Link>
        </div>
        <div className="bg-accent w-full md:w-1/4 md:h-[300px] px-7 py-14 md:py-7 rounded-3xl flex flex-col items-center justify-center text-center md:text-start md:justify-end md:items-start drop-shadow-md hover:scale-105">
          <p className="font-bold text-[20px]">Explore Specialist</p>
          <p className="text-[15px] py-4">
            Discover the right specialist for your specific health needs.
          </p>
          <Link to={"/patient/doctorlist"}>
            <button className="font-semibold bg-secondary text-[12px] text-white px-10 py-2 rounded-full">
              Find Your Specialist Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickLinkSection;
