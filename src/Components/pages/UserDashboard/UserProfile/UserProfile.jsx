import { useEffect, useState } from "react";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";
import editIcon from "../../../../assets/Icons/edit.svg";
import WeightIcon from "../../../../assets/Icons/icons8-weight.svg";
import heightIcon from "../../../../assets/Icons/icons8-height.svg";
import AgeIcon from "../../../../assets/Icons/icons8-calendar.svg";
import moreIcon from "../../../../assets/Icons/more.svg";
import starIcon from "../../../../assets/Icons/star.svg";
import noAppoinmentImg from "../../../../assets/Images/no Appoinment.png";
import BloodIcon from "../../../../assets/Icons/icons8-blood.svg";
import { Link } from "react-router-dom";
import getDataFromSubCollection from "../../../../Utils/dataFetch/getDataFromSubCollection";
import { useAuth } from "../../../AuthContext/AuthContext";
import { useUser } from "../../../UserContext/UserContext";
import ReportComponent from "../../ReportComponent/ReportComponent";

const UserProfile = () => {
  const { uid } = useAuth();
  const { user } = useUser();
  const [userData, setUserData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [favouriteData, setFavouriteData] = useState([]);

  useEffect(() => {
    getDataFromSubCollection("patient", uid, "favorites", setFavouriteData);
  }, []);

  useEffect(() => {
    getDataFromCollection("patient", setUserData);
  }, []);
  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  const userDoc = Object.values(userData).find((doc) => doc.dataId === uid);
  return (
    <div className="w-full h-screen flex  justify-end font-Inter">
      <div className="h-screen w-full md:w-5/6 mt-24 md:mt-32 px-5 md:px-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-5">
            <img
              className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] rounded-full"
              src={user.img}
              alt="profile"
            />
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="font-medium text-[15px]">Premium member</p>
            </div>
          </div>
          <Link to={"/patient/edit"}>
            <div className="flex flex-col items-center gap-1">
              <img
                className="w-[15px] md:w-[20px]"
                src={editIcon}
                alt="editIcon"
              />
              <p className="text-[12px] md:text-[16px]">Edit</p>
            </div>
          </Link>
        </div>

        <section className="mt-12 md:mt-16 grid grid-cols-2 gap-7 md:gap-0 md:flex w-full items-center  md:justify-between py-5 md:px-14 border-2 rounded-3xl">
          <div className="flex items-center justify-center gap-3 md:gap-5 md:border-r-2 md:pr-14">
            <img
              className="rounded-full bg-lightblue p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={heightIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-semibold text-[14px] md:text-[16px] ">
                Height
              </p>
              <p className="font-semibold text-[13px] md:text-[15px] text-gray-400">{`${userDoc?.height} Feet`}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5 md:border-r-2 md:pr-10">
            <img
              className="rounded-full bg-lightblue p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={WeightIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-semibold text-[14px] md:text-[16px] ">
                Weight
              </p>
              <p className="font-semibold text-[13px] md:text-[15px] text-gray-400">{`${userDoc?.weight} Kg`}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5 md:border-r-2 md:pr-14">
            <img
              className="rounded-full bg-lightblue p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={AgeIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1">
              <p className="font-semibold text-[14px] md:text-[16px] ">Age</p>
              <p className="font-semibold text-[13px] md:text-[15px] text-gray-400">{`${userDoc?.age} Yr`}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <img
              className="rounded-full bg-lightblue p-2 md:p-3 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
              src={BloodIcon}
              alt=""
            />
            <div className="flex flex-col md:gap-1 ">
              <p className="font-semibold text-[14px] md:text-[16px] ">Blood</p>
              <p className="font-semibold text-[13px] md:text-[15px] text-gray-400">{`${userDoc?.bloodGroup} `}</p>
            </div>
          </div>
        </section>
        <p className="text-[14px] md:text-[17px] mt-10 md:mt-16 font-medium">
          Favourite Doctors
        </p>
        <section
          id="favorite"
          className="mt-10 w-full items-center grid grid-cols-2 gap-5"
        >
          {favouriteData.length > 0 ? (
            favouriteData?.map(({ dataId }, index) => {
              const doctor = Object.values(doctorData).find(
                (doc) => doc.dataId === dataId
              );
              //  console.log('docid:', doctor);
              return (
                <div className="border-2 p-5 w-full rounded-3xl relative">
                  <img
                    className="w-[30px] absolute top-3 right-8"
                    src={moreIcon}
                    alt="more"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-5 items-center">
                      <img
                        className="w-[70px] h-[70px] rounded-full"
                        src={doctor?.img}
                        alt="doctor"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-[15px]">
                          {doctor?.name}
                        </p>
                        <p className="text-[10px] font-semibold">
                          {doctor?.speciality}
                        </p>
                        <div className="flex font-bold text-[12px]">
                          <p>{doctor?.rating}</p>
                          <img src={starIcon} alt="star" />
                        </div>
                      </div>
                    </div>
                    <button className="px-10 bg-lightblueButton py-1 rounded-3xl font-bold text-white text-[12px] mt-10">
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center w-full max-h-[200px] px-10 py-8 border-2 rounded-3xl col-span-2 ">
              <img className="w-[120px]" src={noAppoinmentImg} alt="" />
              <p className="text-[12px] font-semibold text-gray-400 ">
                Favourite Doctors Found here
              </p>
              <Link to={"/patient/doctorlist"}>
                <p className="text-[12px] font-semibold text-lightblueButton hover:scale-105 ">
                  Mark doctors as favorites
                </p>
              </Link>
            </div>
          )}
        </section>
        <section className="my-10">
          <ReportComponent />
        </section>
        <section className="mt-20 md:mt-6"> .</section>
      </div>
    </div>
  );
};

export default UserProfile;
