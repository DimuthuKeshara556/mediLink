import { useEffect, useState } from "react";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";
import { useAuth } from "../../../AuthContext/AuthContext";
import { useUser } from "../../../UserContext/UserContext";
import TotalPatientIcon from "../../../../assets/Icons/DocIcon/patient.svg";
import ExperinceIcon from "../../../../assets/Icons//DocIcon/Experience.svg";
import SpecializationIcon from "../../../../assets/Icons/DocIcon/Specialization.svg";
import ReviewIcon from "../../../../assets/Icons/DocIcon/review.svg";
import CallIcon from "../../../../assets/Icons/DocIcon/call.svg";
import AddressIcon from "../../../../assets/Icons/DocIcon/Address.svg";
import EmailIcon from "../../../../assets/Icons/DocIcon/email.svg";

const DoctorDetailPage = () => {
  const { uid } = useAuth();
  const { user } = useUser();
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  const DoctorDoc = Object.values(doctorData).find((doc) => doc.dataId === uid);

  return (
    <div className="w-full h-screen flex  justify-end font-Inter">
      <div className="h-screen w-5/6 mt-32 px-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-5">
            <img
              className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] rounded-full"
              src={user.img}
              alt="profile"
            />
            <div>
              <p className="font-bold">{DoctorDoc?.name}</p>
              <p className="font-medium text-[15px]">{DoctorDoc?.speciality}</p>
              <p>{DoctorDoc?.rating}</p>
            </div>
          </div>
        </div>

        <section className="mt-12 md:mt-16 grid grid-cols-2 gap-5 md:gap-0 md:grid-cols-4 w-full items-center  md:justify-between py-5 border-2 rounded-3xl">
          <div className="flex items-center justify-center gap-3 md:gap-5 md:border-r-2 ">
            <img
              className="rounded-full bg-[#D4EBF6] p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={TotalPatientIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-medium text-[12px] md:text-[14px] ">
                Total Patients
              </p>
              <p className="font-medium text-[11px] md:text-[14px] text-gray-400">{`${
                DoctorDoc?.totalPatientNo.length > 0
                  ? DoctorDoc?.totalPatientNo
                  : "Not Set"
              }`}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5 md:border-r-2 ">
            <img
              className="rounded-full bg-[#D4EBF6] p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={ExperinceIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-medium text-[12px] md:text-[14px] ">
                Years of Experience
              </p>
              <p className="font-medium text-[11px] md:text-[14px] text-gray-400">{`${
                DoctorDoc?.yearOfExperince.length > 0
                  ? DoctorDoc?.yearOfExperince
                  : "Not Set"
              }`}</p>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-3 md:gap-5 md:border-r-2 ">
            <img
              className="rounded-full bg-[#D4EBF6] p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={SpecializationIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-medium text-[12px] md:text-[14px] ">
                Specialization
              </p>
              <p className="font-medium text-[11px] md:text-[14px] text-gray-400">{`${DoctorDoc?.speciality}`}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <img
              className="rounded-full bg-[#D4EBF6] p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={ReviewIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-medium text-[12px] md:text-[14px] ">Ratings</p>
              <p className="font-medium text-[11px] md:text-[14px] text-gray-400">{`${DoctorDoc?.rating} `}</p>
            </div>
          </div>
        </section>
        <section className="mt-14">
          <p className="font-medium text-[17px]">Contact Information</p>
          <div className="w-full grid grid-cols-2 gap-5 mt-8">
            <div className="flex gap-5">
              <img
                className="w-[50px] h-[50px] bg-[#D9D9D9] p-3 rounded-full"
                src={CallIcon}
                alt=""
              />
              <div>
                <p>Phone Number :</p>
                <p className="text-gray-400">{DoctorDoc?.phoneNumber}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <img
                className="w-[50px] h-[50px] bg-[#D9D9D9] p-3 rounded-full"
                src={EmailIcon}
                alt=""
              />
              <div>
                <p>Email :</p>
                <p className="text-gray-400">{DoctorDoc?.email}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <img
                className="w-[50px] h-[50px] bg-[#D9D9D9] p-3 rounded-full"
                src={AddressIcon}
                alt=""
              />
              <div>
                <p>Address</p>
                <p className="text-gray-400">{DoctorDoc?.address}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
