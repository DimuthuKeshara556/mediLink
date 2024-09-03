import SingUpImage from "../../../assets/Images/sinupImg.png";
import patientImage from "../../../assets/Images/patient.png";
import doctorImage from "../../../assets/Images/doctorImg.png";
import { Link, Navigate } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const SignUp = () => {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen items-center justify-between px-10 gap-10">
      <Link to={"/"}>
          <div className="absolute top-10 right-10">
            <CloseRoundedIcon />
          </div>
        </Link>
      <div className="hidden md:flex w-1/2">
        <img src={SingUpImage} alt="" />
      </div>
      <div className="w-full md:w-1/2 md:p-5">
        <p className="font-bold text-[25px]">Choose Your Role</p>
        <p className="text-gray-500 mt-3">
          Select your role to continue with the registration process. Whether
          you're seeking healthcare services as a patient or providing care as a
          doctor, we have tailored options just for you.
        </p>
        <div className="flex flex-col md:flex-row gap-20 md:gap-10 mt-14 md:mt-10 py-14  md:py-10">
          <Link to={"/signupp"}>
          <div className="relative bg-accent rounded-3xl flex flex-col gap-3 items-start justify-end py-5 p-5 h-[180px] ">
            <img
              className="absolute -top-14 left-0 w-[90px]"
              src={patientImage}
              alt=""
            />
            <p className="font-bold text-[17px]">Join as a Patient</p>
            <p className="font-medium text-[12px] text-darkgray ">
              Access personalized healthcare, book appointments, and manage your
              health records effortlessly.
            </p>
          </div>
          </Link>
          <Link to={"/signupdoc"}>
          <div className="relative bg-accent rounded-3xl flex flex-col gap-3 items-start justify-end py-5 p-5 h-[180px] ">
            <img
              className="absolute -top-14 left-0 w-[90px]"
              src={doctorImage}
              alt=""
            />
            <p className="font-bold text-[17px]">Join as a Doctor</p>
            <p className="font-medium text-[12px] text-darkgray ">
              Connect with patients, expand your practice, and provide
              top-quality care through our advanced platform.
            </p>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp
