import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import db from "../../../../src/Firebase/firebase";
import calanderIcon from "../../../assets/Icons/calander.svg";
import commentIcon from "../../../assets/Icons/DocIcon/comment.svg";
import moreIcon from "../../../assets//Icons/more.svg";
import fileIcon from "../../../assets/Icons/DocIcon/files.svg";
import bloodIcon from "../../../assets/Images/blood.png";
import { useAuth } from "../../AuthContext/AuthContext";

const ReportComponent = () => {
  const { uid } = useAuth();
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const filesCollection = collection(db, `reports/${uid}/uploaded`);
    const filesSnapshot = await getDocs(filesCollection);
    const filesList = filesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFiles(filesList);
  };

  const handleDelete = async (fileId) => {
    try {
      const fileRef = doc(db, `reports/${uid}/uploaded/${fileId}`);
      await deleteDoc(fileRef);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleAddComment = async (fileId, newComment) => {
    const fileDocRef = doc(db, `reports/${uid}/uploaded/${fileId}`);
    await updateDoc(fileDocRef, {
      comments: arrayUnion(newComment),
    });
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, [uid]);

  return (
    <>
      {files?.length > 0 ? (
        <section className="mt-10 ">
          <p className="text-[14px] md:text-[17px] font-medium mt-10">
            Recent Lab Reports
          </p>
          <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onAddComment={handleAddComment}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 text-center text-gray-500">
          {/* No data available */}
        </div>
      )}
    </>
  );
};

const FileCard = ({ file, onAddComment, handleDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  return (
    <div className="w-full h-fit border-2 rounded-3xl px-5 md:px-10 py-6 shadow-md">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 md:gap-5">
          <img
            className="w-[14px] md:w-[18px]"
            src={calanderIcon}
            alt="Calendar Icon"
          />
          <p className="font-medium text-[11px] md:text-[14px]">
            {file.uploadDate}
          </p>
        </div>
        <div className="w-fit relative">
          <img
            className="w-[20px] md:w-[25px]"
            onClick={toggleMoreDropdown}
            src={moreIcon}
            alt=""
          />
          {isMoreDropdownOpen && (
            <div className="absolute right-0 mt-0 bg-white border border-gray-300 rounded-lg shadow-lg p-5 flex flex-col gap-3 items-start">
              <button
                onClick={() => handleDelete(file.id)}
                className="w-56 bg-[#FF4141] text-white font-semibold text-[12px] rounded-full px-5 py-3 hover:scale-105"
              >
                Delete File
              </button>
            </div>
          )}
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
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[14px] md:text-[17px]">
                {file.category}
              </p>
              <p className="font-semibold text-[13px] text-gray-400">
                {file.title}
              </p>
            </div>
            {/* <img className="w-[20px]" src={downIcon} alt="Download Icon" /> */}
          </div>
          <hr className="border-1" />
          {
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <img src={commentIcon} alt="Comment Icon" />
                <button
                  className="text-[12px] md:text-[16px] text-lightblueButton"
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
                  <button className=" text-[12px] md:text-[16px] text-lightblueButton">
                    View Report
                  </button>
                </div>
              </a>
            </div>
          }
          {isDropdownOpen && (
            <div className="text-[12px] md:text-[15px] text-gray-600">
              {file.comments && file.comments.length > 0 ? (
                <ul className="list-disc ml-5 mt-2">
                  {file.comments.map((comment, index) => (
                    <li key={index} className="mt-1">
                      {comment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-5 mt-2">No comment available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportComponent;
