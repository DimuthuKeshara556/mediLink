import React from "react";
import { Link } from "react-router-dom";
import gif from "../../../assets/Gif/success.gif";

const Success = () => {
  return (
    <div className="flex h-[75vh] flex-col items-center justify-center gap-4 bg-gray-200 px-10 py-10 rounded-3xl">
      <img className="w-[200px]" src={gif} alt="" />
      <h2 className=" font-semibold text-[20px]">Success!</h2>
      <p className="text-[13px] font-medium">
        Your information has been submitted successfully.
      </p>
      <Link to={"/login"}>
        <button className="hover:bg-lightblueButton hover:text-white px-8 py-2 rounded-3xl font-bold border-2 border-lightblueButton text-lightblueButton mt-8">
          continue
        </button>
      </Link>
    </div>
  );
};

export default Success;
