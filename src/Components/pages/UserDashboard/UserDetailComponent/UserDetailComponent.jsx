import uploadIcon from "../../../../assets/Icons/drive_folder_upload.svg";
import settingsIcon from "../../../../assets/Icons/settings.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import FileUpload from "../FileUploadComponent/FileUpload";
import { useUser } from "../../../UserContext/UserContext";
import Greeting from "./Greeting";

const UserDetailComponent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser();
  const [localImg, setLocalImg] = useState(user?.img);

  useEffect(() => {
    if (user?.img) {
      setLocalImg(user.img);
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-full">
      <div className="w-full flex gap-5 items-center justify-end fixed top-14 right-5 md:right-20"></div>
      <div className="flex sticky  md:top-24 items-center justify-between bg-primary p-2 md:p-5 rounded-2xl md:rounded-3xl">
        <div className="flex flex-row items-center gap-2 md:gap-5">
          <img
            className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] rounded-full"
            src={localImg}
            alt="profileImage"
          />
          <div className="flex flex-col">
            <p className="text-[11px] md:text-[15px] text-white">
              <Greeting />
            </p>
            <p className="text-[12px] md:text-[17px] font-semibold text-white">
              {user.name}
            </p>
          </div>
        </div>
        <div className="flex gap-3 md:gap-5 items-center">
          <Link to={"/patient/doctorlist"}>
            <button className="text-white px-2 md:px-6 py-2 text-[10px] md:text-[15px] bg-lightblueButton rounded-full hover:scale-105">
              New appointment
            </button>
          </Link>
          <div>
            <div
              onClick={toggleDropdown}
              className="flex flex-col items-center gap-1 hover:scale-105 "
            >
              <img src={uploadIcon} alt="uploadIcon" />
              <p className="hidden md:flex text-white text-[10px]">
                Upload Files
              </p>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-20 mt-3 w-98 bg-white border border-gray-300 rounded-lg shadow-lg p-10">
                <FileUpload />
                <button
                  className="w-full mt-2 border-2 rounded-3xl py-2 font-semibold"
                  onClick={toggleDropdown}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <Link to={"/patient/edit"}>
            <div className="hover:scale-105  flex-col items-center gap-1 hidden md:flex">
              <img src={settingsIcon} alt="settingsIcon" />
              <p className="hidden md:flex text-white text-[10px]">Settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetailComponent;
