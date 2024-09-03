import WeightIcon from "../../../../assets/Icons/icons8-weight.svg";
import heightIcon from "../../../../assets/Icons/icons8-height.svg";
import AgeIcon from "../../../../assets/Icons/icons8-calendar.svg";
import BloodIcon from "../../../../assets/Icons/icons8-blood.svg";
import CameraIcon from "../../../../assets/Icons/camera.svg";
import React, { useState, useEffect } from "react";
import db, { storage, firestore } from "../../../../Firebase/firebase";
import { useAuth } from "../../../AuthContext/AuthContext";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useUser } from "../../../UserContext/UserContext";
import Popup from "../../Popup/Popup";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";

const EditUserPage = () => {
  const { uid } = useAuth();
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const { user } = useUser();
  const { setUser } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;
    const storageRef = ref(storage, `${uid}/profile`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          updateImage(downloadURL);
        });
      }
    );
  };

  const updateImage = async (newImageUrl) => {
    try {
      let userDocRef;
      if (user.role == "P") {
        userDocRef = doc(firestore, "patient", uid);
      } else if (user.role == "D") {
        userDocRef = doc(firestore, "doctor", uid);
      }

      await updateDoc(userDocRef, {
        img: newImageUrl,
      });

      setUser((prevUser) => ({
        ...prevUser,
        img: newImageUrl,
      }));

      alert("Image updated successfully!");
    } catch (error) {
      alert("Error updating image: ", error);
    }
  };

  useEffect(() => {
    getDataFromCollection("patient", setUserData);
  }, []);

  const userDoc = Object.values(userData).find((doc) => doc.dataId === uid);
  const handleUpdateData = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = async () => {
    try {
      const userDoc = doc(db, "patient", uid);
      await updateDoc(userDoc, {
        bloodGroup: bloodGroup,
        weight: weight,
        height: height,
        age: age,
      });
      console.log("Successfully updated");
      navigate("/patient/user");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <div className="w-full h-screen flex  justify-end font-Inter">
      <div className="h-screen w-full md:w-5/6 mt-32 px-10 md:px-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 ">
            <div className="relative">
              {
                <img
                  className="w-[70px] h-[70px] rounded-full"
                  src={imgUrl ? imgUrl : user.img}
                  alt="Patient"
                />
              }
              <img
                className="w-[30px] bg-accent p-1 rounded-full absolute bottom-0 right-0 border-2 border-white"
                onClick={togglePopup}
                src={CameraIcon}
                alt=""
              />
            </div>
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="font-medium text-[15px]">Premium member</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleUpdateData} className="form">
          <section className="mt-12 md:mt-16 grid grid-cols-1 gap-7 md:gap-0 md:flex w-full items-center  md:justify-between py-5 md:px-14 border-2 rounded-3xl">
            <div className="flex items-center justify-center  px-5 md:px-0 gap-5 md:border-r-2 md:pr-14">
              <img
                className="rounded-full bg-lightblue p-2 md:p-3 w-[60px] h-[60px]"
                src={heightIcon}
                alt=""
              />

              <div className="flex flex-col gap-1 pr-3">
                <label
                  htmlFor="height"
                  className="font-semibold text-[14px] md:text-[16px] "
                >
                  Height
                </label>
                <input
                  className="w-full hover:border-2 px-2 py-1 rounded-lg font-semibold text-[13px] md:text-[15px] text-gray-400"
                  type="text"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`${userDoc?.height} Feet`}
                />
              </div>
            </div>
            <div className="flex items-center justify-center px-5 md:px-0 gap-3 md:gap-5 md:border-r-2 md:pr-10">
              <img
                className="rounded-full bg-lightblue p-2 md:p-3 w-[60px] h-[60px]"
                src={WeightIcon}
                alt=""
              />
              <div className="flex flex-col gap-1 pr-3">
                <label
                  htmlFor="weight"
                  className="font-semibold text-[14px] md:text-[16px]"
                >
                  Weight
                </label>
                <input
                  className="w-full hover:border-2 px-2 py-1 rounded-lg font-semibold text-[13px] md:text-[15px] text-gray-400"
                  type="text"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`${userDoc?.weight} Kg`}
                />
              </div>
            </div>
            <div className="flex items-center justify-center px-5 md:px-0 gap-3 md:gap-5 md:border-r-2 md:pr-14">
              <img
                className="rounded-full bg-lightblue p-2 md:p-3 w-[60px] h-[60px]"
                src={AgeIcon}
                alt=""
              />
              <div className="flex flex-col gap-1 pr-3">
                <label
                  htmlFor="age"
                  className="font-semibold text-[14px] md:text-[16px] "
                >
                  Age
                </label>
                <input
                  className="w-full hover:border-2 px-2 py-1 rounded-lg font-semibold text-[13px] md:text-[15px] text-gray-400"
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={`${userDoc?.age} Yr`}
                />
              </div>
            </div>
            <div className="flex items-center px-5 md:px-0 justify-center gap-3 md:gap-5">
              <img
                className="rounded-full bg-lightblue p-2 md:p-3 w-[60px] h-[60px]"
                src={BloodIcon}
                alt=""
              />
              <div className="flex flex-col gap-1 pr-3">
                <label
                  htmlFor="blood_group"
                  className="font-semibold text-[14px] md:text-[16px] "
                >
                  Blood
                </label>
                <input
                  className="w-full hover:border-2 px-2 rounded-lg font-semibold text-[13px] md:text-[15px] text-gray-400"
                  type="text"
                  id="blood_group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder={`${userDoc?.bloodGroup} `}
                />
              </div>
            </div>
          </section>
        </form>
        <section className="w-full mt-10 flex gap-10 items-center justify-end">
          <Link to={"/patient/user"}>
            <button className="px-10 py-2 border-2 rounded-full">cancel</button>
          </Link>

          <button
            onClick={handleUpdateData}
            className="px-10 py-2 bg-lightblueButton font-bold text-white rounded-full"
          >
            Save
          </button>
        </section>
        <Popup isOpen={isPopupOpen} onClose={togglePopup}>
          <form
            onSubmit={handleSubmit}
            className="form flex flex-col items-center gap-5"
          >
            {
              <img
                className="w-[120px] h-[120px] rounded-full"
                src={imgUrl ? imgUrl : user.img}
                alt="Patient"
              />
            }

            <input className="text-[14px]" type="file" id="fileInput" />
            <Box sx={{ width: "100%" }}>
              <LinearProgress variant="determinate" value={progresspercent} />
            </Box>
            <div className="flex gap-5 mt-5">
              <button
                className="bg-lightblueButton px-8 text-white py-2 rounded-full"
                type="submit"
              >
                Upload
              </button>
              <button
                className=" px-8 border-2 py-2 rounded-full"
                type="submit"
                onClick={togglePopup}
              >
                close
              </button>
            </div>
          </form>
        </Popup>
      </div>
    </div>
  );
};

export default EditUserPage;
