import bgImage from "../../../assets/Images/Image2.png";
import Icon1 from "../../../assets/Icons/shield-user-svgrepo-com 1.svg";
import Icon2 from "../../../assets/Icons/24-hours-service-svgrepo-com 1.svg";
import Icon3 from "../../../assets/Icons/doctor-svgrepo-com 1.svg";

const OurSpeciality = () => {
  return (
    <div className="w-full mt-24 mb-20 md:mb-0 md:mt-0 md:h-screen flex items-center justify-center md:justify-between">
      <img className="hidden md:flex h-3/4 mt-14" src={bgImage} alt="image" />
      <div className="w-full flex flex-col gap-5 md:w-1/2 px-10 md:pr-24 ">
        <p className="font-black text-[30px]">Why Choose Us</p>
        <p className="text-[15px] font-medium text-gray-500">
          Experience unparalleled healthcare with MediLink: top doctors,
          seamless appointments, and personalized care—all at your fingertips.
        </p>
        <div className=" flex flex-col gap-5 mt-5">
          <div className="w-full  p-4 flex items-center gap-5 bg-accent rounded-3xl drop-shadow-lg hover:scale-105">
            <img
              className="w-[70px] h-[70px] p-4 bg-lightblue rounded-full"
              src={Icon1}
              alt="IconImage"
            />
            <div className="w-full">
              <p className="text-[17px] font-bold">
                Your Privacy, Our Priority
              </p>
              <p className="text-[13px] font-medium text-gray-500 mt-2">
                At MediLink, your privacy is our priority, with advanced
                security measures ensuring your data remains confidential and
                protected.
              </p>
            </div>
          </div>
          <div className="w-full  p-4 flex items-center gap-4 bg-accent rounded-3xl drop-shadow-lg hover:scale-105">
            <img
              className="w-[70px] h-[70px] p-4 bg-lightblue rounded-full"
              src={Icon2}
              alt="IconImage"
            />
            <div className="w-full">
              <p className="text-[17px] font-bold">
                Available 24/7 for Your Health Needs
              </p>
              <p className="text-[13px] font-medium text-gray-500 mt-2">
                Access expert medical advice and support around the clock with
                MediLink. We're here for you anytime, day or night.
              </p>
            </div>
          </div>
          <div className="w-full  p-4 flex items-center gap-4 bg-accent rounded-3xl drop-shadow-lg hover:scale-105">
            <img
              className="w-[70px] h-[70px] p-4 bg-lightblue rounded-full"
              src={Icon3}
              alt="IconImage"
            />
            <div className="w-full">
              <p className="text-[17px] font-bold">
                Expert Doctors You Can Trust
              </p>
              <p className="text-[13px] font-medium text-gray-500 mt-2">
                Find trusted healthcare professionals on MediLink, offering
                reliable medical advice and personalized care to meet your
                health needs with confidence and expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurSpeciality;
