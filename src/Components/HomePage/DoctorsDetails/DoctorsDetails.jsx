import starImg from "../../../assets/Icons/star.svg";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./commentStyles.css";
import { Navigation } from "swiper/modules";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";
import { Link } from "react-router-dom";

const DoctorsDetails = () => {
  const [setSwiperRef] = useState(null);
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  return (
    <div className="px-1 md:px-10 mt-5">
      <p className="text-3xl font-black font-Raleway text-center md:text-start md:pl-28 ">
        Meet Our
        <br />
        Top Medical Experts
      </p>
      <Swiper
        onSwiper={setSwiperRef}
        centeredSlides={false}
        spaceBetween={200}
        pagination={false}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 200,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 100,
          },
        }}
      >
        {doctorData?.map(
          ({ name, speciality, rating, price, dataId, img }, userid) => (
            <SwiperSlide>
              <CommentBlock
                text=" A medical doctor specializing in the diagnosis, treatment, and prevention of mental health disorders."
                user={name}
                role={speciality}
                rating={rating}
                profileImg={img}
                dataId={dataId}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </div>
  );
};

export default DoctorsDetails;

const CommentBlock = ({ text, user, role, rating, profileImg, dataId }) => {
  return (
    <div className="flex flex-col w-[100%] border-2 shadow-md p-5 rounded-3xl gap-2 mt-5 scale-95 hover:scale-100 ">
      <div
        className="h-[240px] w-full rounded-2xl bg-cover"
        style={{ backgroundImage: `url(${profileImg})` }}
      ></div>
      <p className="text-[] font-bold">{user}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold">{role}</p>
        <div className="flex items-center gap-1">
          <p className="font-bold text-[14px] text-lightblueButton">{rating}</p>
          <img src={starImg} alt="" />
        </div>
      </div>
      <p className="text-xs text-center font-bold mt-1 text-gray-500">{text}</p>
      <Link to={`/patient/newapoinment/${dataId}`}>
        <button className="w-full py-2 bg-lightblueButton rounded-full font-bold text-[15px] mt-5 text-white hover:scale-105">
          Book Now
        </button>
      </Link>
    </div>
  );
};
