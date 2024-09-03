import { Link } from "react-router-dom";
import errorImg from "../../assets/Images/errorImg.png";

const Unkown = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center font-Inter '>
      <img className="w-[300px]" src={errorImg} alt="" />
        <p className="font-semibold text-[14px] text-gray-600">We're sorry, but your login attempt was unsuccessful. Please check your credentials and try again.</p>
        <Link to={"/login"}>
        <p className="font-semibold text-[14px] text-lightblueButton hover:scale-105 mt-5">Go Back</p>
        </Link>
    </div>
  )
}

export default Unkown