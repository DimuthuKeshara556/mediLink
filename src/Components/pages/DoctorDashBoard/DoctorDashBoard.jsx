import userImg from "../../../assets/Icons/defaultProfile.svg";
import editIcon from "../../../assets/Icons/DocIcon/edit.svg";
import deleteIcon from "../../../assets/Icons/DocIcon/remove_circle_outline.svg";
import addIcon from "../../../assets/Icons/DocIcon/addIcon.svg";
import noFoundIcon from "../../../assets/Images/no Appoinment.png";
import { Link, useParams } from "react-router-dom";
import db, { firestore } from "../../../Firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Medication from "./Medication/Medication";
import { getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import calanderIcon from "../../../assets/Icons/calander.svg";
import commentIcon from "../../../assets/Icons/DocIcon/comment.svg";
import fileIcon from "../../../assets/Icons/DocIcon/files.svg";
import downIcon from "../../../assets/Icons/DocIcon/arrow_forward_ios.svg";
import bloodIcon from "../../../assets/Images/blood.png";
import { useAuth } from "../../AuthContext/AuthContext";
import Chat from "../Massage/Chat";
import getDataFromCollection from "../../../Utils/dataFetch/getDataFromCollection";

const DoctorDashBoard = () => {
  const { dataId } = useParams();
  const { uid } = useAuth();
  const [userId, setUserId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [newHeading, setNewHeading] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [files, setFiles] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [patientData, setPatientData] = useState({});

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataRef = doc(firestore, "sessions", dataId);
        const userDataDoc = await getDoc(userDataRef);

        if (userDataDoc.exists()) {
          const userData = userDataDoc.data();

          setUserId(userData.userId);
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchUserData();
  }, [dataId]);

  useEffect(() => {
    const fetchTreatmentPlans = async () => {
      const userRef = doc(firestore, "treatmentPlans", dataId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setTreatmentPlans(userDoc.data().plans || []);
      }
    };

    fetchTreatmentPlans();
  }, [dataId]);

  const handleSave = async () => {
    let updatedPlans;
    if (editIndex !== null) {
      updatedPlans = treatmentPlans.map((plan, index) =>
        index === editIndex
          ? { heading: newHeading, content: newContent }
          : plan
      );
      setEditIndex(null);
    } else {
      updatedPlans = [
        ...treatmentPlans,
        { heading: newHeading, content: newContent },
      ];
    }

    const userRef = doc(firestore, "treatmentPlans", dataId);
    await setDoc(userRef, { plans: updatedPlans }, { merge: true });

    setTreatmentPlans(updatedPlans);
    setNewHeading("");
    setNewContent("");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (index) => {
    setNewHeading(treatmentPlans[index].heading);
    setNewContent(treatmentPlans[index].content);
    setEditIndex(index);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDelete = async (index) => {
    const updatedPlans = treatmentPlans.filter((_, i) => i !== index);
    const userRef = doc(firestore, "treatmentPlans", dataId);
    await setDoc(userRef, { plans: updatedPlans }, { merge: true });

    setTreatmentPlans(updatedPlans);
  };

  const fetchFiles = async () => {
    const filesCollection = collection(db, `reports/${userId}/uploaded`);
    const filesSnapshot = await getDocs(filesCollection);
    const filesList = filesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFiles(filesList);
  };

  const handleAddComment = async (fileId, newComment) => {
    const fileDocRef = doc(db, `reports/${userId}/uploaded/${fileId}`);
    await updateDoc(fileDocRef, {
      comments: arrayUnion(newComment),
    });
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, [userId]);

  useEffect(() => {
    getDataFromCollection("sessions", setSessionData);
  }, [uid]);

  useEffect(() => {
    getDataFromCollection("patient", setPatientData);
  }, [uid]);

  const dateFilteredAppointments = sessionData?.filter(
    ({ docId, status }) => docId === uid && status === "pending"
  );

  const updateStatusToInProgress = async (sessionId, userId) => {
    try {
      const appointmentRef = query(
        collection(db, `appointments/${userId}/appointments`),
        where("sessionId", "==", sessionId)
      );

      const querySnapshot = await getDocs(appointmentRef);

      querySnapshot.forEach(async (docSnapshot) => {
        const appointmentDocRef = docSnapshot.ref;
        await updateDoc(appointmentDocRef, {
          status: "complete",
        });
      });

      const sessionDocRef = doc(db, "sessions", sessionId);
      await updateDoc(sessionDocRef, {
        status: "complete",
      });

      alert("Successfully end the appointment!");
    } catch (error) {
      alert(`Error end the appointment: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-screen flex  justify-end font-Inter">
      <div className="h-screen w-5/6 mt-20 px-20 flex flex-col gap-10">
        <div className="w-full">
          {dateFilteredAppointments.length > 0 ? (
            dateFilteredAppointments
              ?.slice(0, 1)
              .map(({ Date, time, docId, status }, index) => {
                const patient = Object.values(patientData).find(
                  (doc) => doc.dataId === userId
                );
                return (
                  <div className="flex sticky top-24 items-center justify-between bg-primary px-10 py-4 rounded-3xl">
                    <div className="flex flex-row gap-5 items-center justify-center">
                      <img
                        className="w-[55px] h-[55px] rounded-full"
                        src={patient?.img || userImg}
                        alt="profileImage"
                      />

                      <div className="flex flex-col">
                        <p className="font-bold text-white text-[18px]">
                          {patient?.name}
                        </p>
                        <p className="font-semibold  text-gray-400 text-[12px]">
                          {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6 items-center justify-center ">
                      <Link to={"/"}>
                        <button className="text-black px-14 py-2 text-[15px] bg-accent rounded-full ">
                          Cancel
                        </button>
                      </Link>
                      <Link to={"/doctor/home"}>
                        <button
                          onClick={() =>
                            updateStatusToInProgress(dataId, userId)
                          }
                          className="text-white px-14 py-2 text-[15px] bg-lightblueButton rounded-full "
                        >
                          End
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
          ) : (
            <div>loading</div>
          )}
        </div>

        <section className="w-full h-[90vh] ">
          <div className="h-[80vh]">
            <Chat userId={uid} recipientId={userId} sessionId={dataId} />
          </div>
        </section>
        <section className="w-full flex gap-8 mt-5">
          <div className="w-1/2">
            <section>
              <p className="text-[17px] font-medium">Recent Lab Reports</p>
              <div className="mt-5 grid gap-5 w-full">
                {files.length > 0 ? (
                  files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onAddComment={handleAddComment}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 h-[150px] rounded-3xl  text-gray-400 text-[13px] font-semibold">
                    <img className="w-[80px]" src={noFoundIcon} alt="" />
                    <p>No recent lab reports available.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
          <section
            className="w-1/2 grid grid-rows-2 gap-5"
            style={{ gridTemplateRows: "auto auto" }}
          >
            <div className="w-full h-full">
              <h1 className="text-[17px] font-medium mb-2">Treatment Plan</h1>
              <div className="p-4 max-w-md  bg-white rounded-3xl border-2 shadow-md mt-5">
                {treatmentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-3xl mb-4 space-y-2"
                  >
                    <h2 className="text-[15px] font-semibold">
                      {plan.heading}
                    </h2>
                    <p className="text-[14px] text-gray-400">{plan.content}</p>
                    <div className="flex justify-end space-x-3">
                      <img
                        className="cursor-pointer hover:scale-105"
                        onClick={() => handleEdit(index)}
                        src={editIcon}
                        alt=""
                      />
                      <img
                        className="cursor-pointer hover:scale-105"
                        onClick={() => handleDelete(index)}
                        src={deleteIcon}
                        alt=""
                      />
                    </div>
                  </div>
                ))}

                <div className="w-full flex items-center justify-between">
                  <p
                    className={`text-gray-400 text-[13px] font-semibold ${
                      isDropdownOpen ? "hidden" : "flex"
                    }`}
                  >
                    Tap the button to begin enter the treatment plan...
                  </p>
                  <img
                    onClick={toggleDropdown}
                    className={`cursor-pointer w-[30px] ${
                      isDropdownOpen ? "hidden" : "flex"
                    }`}
                    src={addIcon}
                    alt="Add"
                  />
                  {isDropdownOpen && (
                    <div className="mt-2 p-4 text-[13px]">
                      <input
                        type="text"
                        placeholder="Heading"
                        className="border rounded-lg p-2 w-full mb-2"
                        value={newHeading}
                        onChange={(e) => setNewHeading(e.target.value)}
                      />
                      <textarea
                        placeholder="Content"
                        className="border rounded-lg p-2 w-full mb-2"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                      />
                      <div className="w-full flex gap-4 items-center">
                        <button
                          onClick={toggleDropdown}
                          className="w-1/2 rounded-full p-2 text-[14px] border-2 bg-white"
                        >
                          Cancle
                        </button>
                        <button
                          onClick={handleSave}
                          className="w-1/2 bg-blue-500 text-white rounded-full p-2 text-[14px]"
                        >
                          {editIndex !== null ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full  h-full">
              <h1 className="text-[17px] font-medium mb-5">Medications</h1>
              <Medication userId={dataId} />
            </div>
          </section>
        </section>
        <section className=" h-1/5 mb-20">
          <p>" "</p>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashBoard;

const FileCard = ({ file, onAddComment }) => {
  const [comment, setComment] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    onAddComment(file.id, comment);
    setComment("");
  };

  return (
    <div className="w-full border-2 rounded-3xl px-10 py-5 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-5">
          <img className="w-[14px]" src={calanderIcon} alt="Calendar Icon" />
          <p className="text-[12px] font-medium">{file.uploadDate}</p>
        </div>
      </div>
      <div className="flex gap-5 items-start justify-between mt-5">
        <img
          className="bg-[#FFA082] w-[50px] h-[50px] rounded-full p-3"
          src={bloodIcon}
          alt="Blood Icon"
        />
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <div>
                <p>{file.category}</p>
                <p>{file.title}</p>
              </div>
            </div>
            <img className="w-[20px]" src={downIcon} alt="Download Icon" />
          </div>
          <hr className="border-1" />
          {!isDropdownOpen && (
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <img src={commentIcon} alt="Comment Icon" />
                <button
                  className="text-lightblueButton"
                  onClick={toggleDropdown}
                >
                  Comments
                </button>
              </div>
              <a
                href={file.downloadURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex gap-3">
                  <img src={fileIcon} alt="File Icon" />
                  <button className="text-lightblueButton">View</button>
                </div>
              </a>
            </div>
          )}
          {isDropdownOpen && (
            <div className="text-[15px] text-gray-600">
              {file.comments && file.comments.length > 0 && (
                <ul className="list-disc ml-5 mt-2">
                  {file.comments.map((comment, index) => (
                    <li key={index} className="mt-1">
                      {comment}
                    </li>
                  ))}
                </ul>
              )}
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                className="border px-5 py-2 rounded-3xl w-full mt-4 text-[13px]"
              />
              <div className="flex gap-5 items-center justify-end mt-5">
                <button
                  className="border rounded-3xl py-2 px-5 text-[13px] font-medium text-white bg-blue-500 hover:bg-blue-700 "
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>
                <button
                  className="border rounded-3xl py-2 px-10 text-[13px] font-medium "
                  onClick={toggleDropdown}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
