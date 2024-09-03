import NeurologyImg from "../../../../assets/Images/Cata/Neurology.png";
import CardiologyImg from "../../../../assets/Images/Cata/Cardiology.png";
import OrthopaedicImg from "../../../../assets/Images/Cata/Orthopaedic.png";
import DermatologyImg from "../../../../assets/Images/Cata/Dermatology.png";
import PediatricsImg from "../../../../assets/Images/Cata/Pediatrics.png";
import OphthalmologyImg from "../../../../assets/Images/Cata/Ophthalmology.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import getDataFromCollection from "../../../../Utils/dataFetch/getDataFromCollection";
import getDataFromSubCollection from "../../../../Utils/dataFetch/getDataFromSubCollection";
import { useAuth } from "../../../AuthContext/AuthContext";
import DoctorToggle from "./DoctorToggle";
import noDoctorImg from "../../../../assets/Gif/noDoctor.gif";
import StarImg from "../../../../assets/Icons/star.svg";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../../../Firebase/firebase";

const DoctorList = () => {
  const [doctorData, setDoctorData] = useState([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);
  const [dateFilteredDoctors, setDateFilteredDoctors] = useState([]);
  const [seeAll, setSeeAll] = useState(false);
  const [seeAllSavedDoc, setSeeAllSavedDoc] = useState(false);
  const [seeAllDoctors, setSeeAllDoctors] = useState(true);
  const { uid } = useAuth();
  const [docItem, setItems] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const items = [
    { id: 0, type: "Psychiatrist", img: NeurologyImg },
    { id: 1, type: "Cardiology", img: CardiologyImg },
    { id: 2, type: "Orthopaedic", img: OrthopaedicImg },
    { id: 3, type: "Dermatology", img: DermatologyImg },
    { id: 4, type: "Pediatrics", img: PediatricsImg },
    { id: 5, type: "Ophthalmology", img: OphthalmologyImg },
    { id: 6, type: "Gastroenterology", img: NeurologyImg },
    { id: 7, type: "Neurology", img: NeurologyImg },
    { id: 8, type: "Oncology", img: NeurologyImg },
    { id: 9, type: "Urology", img: NeurologyImg },
  ];
  useEffect(() => {
    getDataFromCollection("doctor", setDoctorData);
  }, []);

  const [selectedItem, setSelectedItem] = useState("0");

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  const handleSeeAll = () => {
    setSeeAll(!seeAll);
  };
  const handleSeeAllSaved = () => {
    setSeeAllSavedDoc(!seeAllSavedDoc);
  };
  const handleSeeAllDoctors = () => {
    setSeeAllDoctors(!seeAllDoctors);
  };
  useEffect(() => {
    setDateFilteredDoctors(
      doctorData?.filter(({ speciality }) => speciality === selectedItem.type)
    );
  }, [selectedItem]);

  const fetchFaviouriteDoctorData = () => {
    getDataFromSubCollection("patient", uid, "favorites", setFavoriteDoctors);
  };
  const fetchDoctorData = () => {
    getDataFromCollection("doctor", setDoctorData);
  };

  const refetchData = () => {
    fetchFaviouriteDoctorData();
    fetchDoctorData();
  };

  useEffect(() => {
    fetchFaviouriteDoctorData();
  }, []);

  useEffect(() => {
    fetchDoctorData();
  }, [uid]);

  const fetchItems = async () => {
    const itemsRef = collection(firestore, "doctor");
    const q = query(itemsRef, limit(2));
    const querySnapshot = await getDocs(q);

    const newItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(newItems);

    const lastVisibleItem = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleItem);

    if (querySnapshot.docs.length < 2) {
      setHasMore(false);
    }
  };

  const fetchMoreItems = async () => {
    if (loading || !lastVisible || !hasMore) return;
    setLoading(true);

    const itemsRef = collection(firestore, "doctor");
    const q = query(itemsRef, startAfter(lastVisible), limit(2));
    const querySnapshot = await getDocs(q);

    const newItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems((prevItems) => [...prevItems, ...newItems]);

    const lastVisibleItem = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisible(lastVisibleItem);

    if (querySnapshot.docs.length < 2) {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);
  //  console.log(docItem);

  return (
    <div className="w-full h-screen flex justify-center md:justify-end">
      <div className="h-screen w-full md:w-5/6 mt-20 md:mt-32 px-5 md:px-24">
        <section>
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <p className="font-medium text-[14px] md:text-[17px]">
              Looking for a desired doctor{" "}
            </p>
            <button
              className="font-medium text-[13px] md:text-[14px] hover:text-lightblueButton"
              onClick={handleSeeAllDoctors}
            >
              {" "}
              {seeAllDoctors ? "See All" : "Show less"}
            </button>
          </div>
          <div className="w-full grid grid-flow-row grid-cols-4 md:grid-cols-6 gap-5 items-center justify-between mb-8 md:mb-10">
            {seeAllDoctors
              ? items.splice(0, window.innerWidth < 768 ? 4 : 6).map((item) => (
                  <div
                    onClick={() => handleSelect(item)}
                    className={`flex flex-col items-center gap-2`}
                  >
                    <img
                      className={`w-[50px] h-[50px] border-2 rounded-full shadow-lg ${
                        selectedItem?.id === item.id
                          ? "border-4 rounded-full p-1 border-lightblueButton"
                          : ""
                      }`}
                      src={item.img}
                      alt="Neurology"
                    />
                    <p
                      className={`text-[11px] md:text-[13px] font-medium text-gray-400 ${
                        selectedItem?.id === item.id
                          ? "font-bold text-lightblueButton "
                          : ""
                      }`}
                    >
                      {item.type}
                    </p>
                  </div>
                ))
              : items.map((item) => (
                  <div
                    onClick={() => handleSelect(item)}
                    className={`flex flex-col items-center gap-2`}
                  >
                    <img
                      className={`w-[50px] h-[50px] border-2 rounded-full shadow-lg ${
                        selectedItem?.id === item.id
                          ? "border-4 rounded-full p-1 border-lightblueButton"
                          : ""
                      }`}
                      src={item.img}
                      alt="Neurology"
                    />
                    <p
                      className={`text-[11px] md:text-[13px] font-medium text-gray-400 ${
                        selectedItem?.id === item.id
                          ? "font-bold text-lightblueButton "
                          : ""
                      }`}
                    >
                      {item.type}
                    </p>
                  </div>
                ))}
          </div>
        </section>
        <section className="w-full mb-10">
          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            {dateFilteredDoctors.length ? (
              dateFilteredDoctors.map(
                ({ name, speciality, rating, price, dataId, img }, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-between py-6 md:py-8 px-5 pt-10 pr-8 gap-3 border-2 shadow-lg rounded-3xl"
                  >
                    <div className="absolute top-3 right-5">
                      <DoctorToggle
                        patientId={uid}
                        doctorId={dataId}
                        onToggle={refetchData}
                      />
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div className="flex gap-3 md:gap-5 items-center">
                        <img
                          className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full shadow-lg"
                          src={img}
                          alt=""
                        />
                        <div>
                          <p className="font-semibold text-[14px] md:text-[17px]">
                            {name}
                          </p>
                          <p className="font-semibold text-[12px] md:text-[13px] text-gray-400">
                            {speciality}
                          </p>
                          <div className="flex gap-1 items-center mt-1">
                            <p className="font-semibold text-[12px] md:text-[13px] text-lightblueButton">
                              {rating}
                            </p>
                            <img
                              className="w-[12px] md:w-[15px]"
                              src={StarImg}
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 mt-2">
                        <p className="font-semibold text-[13px]">Rs:{price}</p>
                        <Link to={`/patient/newapoinment/${dataId}`}>
                          {/* <button className="bg-lightblueButton px-5 py-2 font-bold text-white rounded-full text-[12px]"> */}
                          <button className="px-3 md:px-6 py-2 text-[10px] md:text-[15px] bg-lightblueButton rounded-full text-white hover:scale-105">
                            Book Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <></>
            )}
          </div>
        </section>
        <section>
          <div className="w-full items-center flex justify-between mb-10">
            <p className="font-medium text-[14px] md:text-[17px]">
              Saved Doctors
            </p>
            <p
              onClick={handleSeeAllSaved}
              className="font-medium text-[14px] hover:text-lightblueButton"
            >
              {seeAllSavedDoc ? "See All" : "Show less"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-10">
            {favoriteDoctors && favoriteDoctors.length === 0 ? (
              <div className="w-full col-span-2  p-5 flex flex-col md:flex-row items-center justify-center gap-10 border-2 shadow-lg rounded-3xl">
                <img
                  className="w-[150px] md:w-[200px]"
                  src={noDoctorImg}
                  alt=""
                />
                <div className="flex flex-col items-center justify-center text-[12px] text-lightblueButton ">
                  <p>No doctors available right now</p>
                  <p>Please add your favorite doctors here</p>
                </div>
              </div>
            ) : (
              favoriteDoctors
                ?.slice(0, seeAllSavedDoc ? items.length : 2)
                .map(({ dataId }, index) => {
                  const doctor = Object.values(doctorData).find(
                    (doc) => doc.dataId === dataId
                  );
                  return (
                    <div
                      key={index}
                      className="relative flex flex-col w-full items-center justify-between  py-6 md:py-8 px-5 pt-10 pr-8 gap-3 border-2 shadow-lg rounded-3xl"
                    >
                      <div className="absolute top-3 right-5">
                        <DoctorToggle
                          patientId={uid}
                          doctorId={dataId}
                          onToggle={refetchData}
                        />
                      </div>
                      <div className="w-full flex items-center justify-between">
                        <div className="flex gap-3 md:gap-5 items-center">
                          <img
                            className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full shadow-lg"
                            src={doctor.img}
                            alt=""
                          />
                          <div className="">
                            <p className="font-semibold text-[14px] md:text-[17px]">
                              {doctor.name}
                            </p>
                            <p className="font-semibold text-[12px] md:text-[13px] text-gray-400">
                              {doctor.speciality}
                            </p>
                            <div className="flex gap-1 items-center mt-1">
                              <p className="font-semibold text-[12px] md:text-[13px] text-lightblueButton">
                                {doctor.rating}
                              </p>
                              <img
                                className="w-[12px] md:w-[15px]"
                                src={StarImg}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 mt-2">
                          <p className="font-semibold text-[13px]">
                            Rs:{doctor.price}
                          </p>
                          <Link to={`/patient/newapoinment/${dataId}`}>
                            <button className="px-3 md:px-6 py-2 text-[10px] md:text-[15px] bg-lightblueButton rounded-full text-white hover:scale-105">
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </section>
        <section>
          <div className="w-full h-fit items-center flex justify-between mb-5">
            <p className="font-medium text-[14px] md:text-[17px]">
              All Doctors
            </p>
          </div>

          <div className="gap-7 grid grid-cols-1 md:grid-cols-2 mt-10 ">
            {docItem?.map(
              (
                { name, speciality, rating, price, dataId, img, id },
                userid
              ) => (
                <div className="relative flex flex-col w-full items-center justify-between  py-6 md:py-8 px-5 pt-10 pr-8 gap-3 border-2 shadow-lg rounded-3xl">
                  <div className="absolute top-3 right-5">
                    <DoctorToggle
                      patientId={uid}
                      doctorId={id}
                      onToggle={refetchData}
                    />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <div className="flex gap-3 md:gap-5  items-center">
                      <img
                        className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full shadow-lg"
                        src={img}
                        alt=""
                      />
                      <div className="">
                        <p className="font-semibold text-[14px] md:text-[17px] ">
                          {name}
                        </p>
                        <p className="font-semibold text-[12px] md:text-[13px] text-gray-400">
                          {speciality}
                        </p>
                        <div className="flex gap-1 items-center mt-1">
                          <p className="font-semibold text-[12px] md:text-[13px] text-lightblueButton ">
                            {rating}
                          </p>
                          <img src={StarImg} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 mt-2">
                      <p className="font-semibold text-[13px]">Rs:{price}</p>
                      <Link to={`/patient/newapoinment/${id}`}>
                        <button className="px-3 md:px-6 py-2 text-[10px] md:text-[15px] bg-lightblueButton rounded-full text-white hover:scale-105">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
            {hasMore && (
              <div className="w-full col-span-2 flex items-center justify-center">
                <button
                  onClick={fetchMoreItems}
                  disabled={loading}
                  className="text-[12px] font-medium px-5 py-2 border-2 rounded-full hover:scale-105 "
                >
                  {loading ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </div>
        </section>
        <section className="mt-20 md:m1-10">"."</section>
      </div>
    </div>
  );
};

export default DoctorList;
