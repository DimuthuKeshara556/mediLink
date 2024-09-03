import Footer from "../Components/FooterSection/Footer";
import DoctorsDetails from "../Components/HomePage/DoctorsDetails/DoctorsDetails";
import HeroSection from "../Components/HomePage/HeroSection/HeroSection";
import OurSpeciality from "../Components/HomePage/OurSpecialityPage/OurSpeciality";
import QuickLinkSection from "../Components/HomePage/QuickLinkSection/QuickLinkSection";

const WebContext = () => {
  return (
    <div>
      <HeroSection />
      <QuickLinkSection />
      <OurSpeciality />
      <DoctorsDetails />
      <Footer />
    </div>
  );
};

export default WebContext;
