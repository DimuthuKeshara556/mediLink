import logo from "../../assets/Icons/MediLink logo.png";
import facebook from "../../assets/Icons/fb.svg";
import xIcon from "../../assets/Icons/x-socia.svg";
import linkedin from "../../assets/Icons/linkedin.svg";
import youtube from "../../assets/Icons/youtube.svg";

const Footer = () => {
  return (
    <div id="footer" className="w-full flex flex-col p-10 bg-accent">
      <section className="flex flex-col gap-10 md:gap-0 md:flex-row">
        <div className="w-1/3">
          <img className="w-[100px]" src={logo} alt="logo" />
        </div>

        <div className="grid md:grid-cols-3 w-2/3 gap-7">
          <div className="w-full flex flex-col gap-3">
            <p className="font-bold text-[18px]">Quick Links</p>
            <section className="flex flex-col gap-1 text-darkgray text-[15px] font-medium">
              <p>Home</p>
              <p>About Us</p>
              <p>Find a doctor</p>
              <p>Appontment</p>
              <p>Explore treatment</p>
            </section>
          </div>
          <div className="w-full flex flex-col gap-3">
            <p className="font-bold text-[18px]">Our Services</p>
            <section className="flex flex-col gap-1 text-darkgray text-[15px] font-medium">
              <p>Telemedicine</p>
              <p>Virtual Consultations</p>
              <p>Appointment Scheduling</p>
              <p>Health Records Management</p>
            </section>
          </div>
          <div className="w-full flex flex-col gap-3">
            <p className="font-bold text-[18px]">Specialties</p>
            <section className="flex flex-col gap-1 text-darkgray text-[15px] font-medium">
              {" "}
              <p>Cardiology</p>
              <p>Dermatology</p>
              <p>Neurology</p>
              <p>Pediatrics</p>
            </section>
          </div>

          <div className="w-full flex flex-col gap-3">
            <p className="font-bold text-[18px]">Resources</p>
            <section className="flex flex-col gap-1 text-darkgray text-[15px] font-medium">
              <p>FAQs</p>
            </section>
          </div>
          <div lassName="w-full flex flex-col">
            <p className="font-bold text-[18px]">Follow us on</p>
            <div className="flex gap-3 mt-3">
              <img className="w-[32px]" src={facebook} alt="fb" />
              <img className="w-[32px]" src={xIcon} alt="x" />
              <img className="w-[32px]" src={linkedin} alt="linkedin" />
              <img className="w-[32px]" src={youtube} alt="youtube" />
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col-reverse md:flex-row items-center justify-between mt-24 text-darkgray text-[15px] font-medium">
        <p>© 2024 MediLink. All rights reserved.</p>
        <div className="flex items-center  mb-5 md:mb-0 gap-20">
          <p>Privacy</p>
          <p>Terms of services</p>
        </div>
      </section>
    </div>
  );
};

export default Footer;
