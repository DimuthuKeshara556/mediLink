import { Link, Navigate } from "react-router-dom";
import heroImage from "../../../assets/Images/HeroImage.png";

const HeroSection = () => {
  return (
    <section className="w-full h-screen flex flex-col-reverse items-center justify-center md:flex-row md:justify-between md:pl-10 bg-accent relative">
      <div className="text-primary">
        <div className="flex flex-col items-center md:items-start justify-center">
          <h1 className="text-[20px] md:text-[50px] font-black leading-tight">
            Connect to
            <br />
            Care Instantly
          </h1>
          <p className="text-[12px] md:text-[15px] p-10 md:p-0 md:pr-10 text-center md:text-start md:py-5 font-medium">
            Discover the convenience of MediLink, where booking appointments and
            accessing virtual consultations with top healthcare professionals is
            just a click away.
          </p>
          <Link to={`/home`}>
            <button className="py-3 px-14 mb-8 text-[10px] md:text-[15px] font-bold text-white rounded-full bg-secondary">
              Get Appointment
            </button>
          </Link>
        </div>

        <div className="stats absolute flex w-[90%] mx-5 md:mx-0 md:w-1/2 left-0 md:left-10 md:bottom-5 items-center justify-around p-4 border rounded-2xl bg-white drop-shadow-2xl">
          <Statistic value="100" label="Best Doctor" />
          <Statistic value="30" label="Specialist Doctor" />
          <Statistic value="10K+" label="Happy Patients" />
        </div>
      </div>

      <img
        className="pl-14 md:pl-0 w-full h-fit mb-10 md:mb-0 md:w-auto md:h-screen"
        src={heroImage}
        alt="Hero"
      />
    </section>
  );
};

const Statistic = ({ value, label }) => {
  return (
    <div className="flex flex-col text-center">
      <p className="text-[15px] md:text-[35px] font-bold">{value}</p>
      <p className="text-[15px] md:text-[17px] font-medium text-secondary">
        {label.split(" ").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
};

export default HeroSection;
