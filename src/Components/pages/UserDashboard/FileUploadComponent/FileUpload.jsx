import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection } from "firebase/firestore";
import db, { storage } from "../../../../Firebase/firebase";
import { useAuth } from "../../../AuthContext/AuthContext";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const { uid } = useAuth();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const time = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateTimeString = `${date} ${month} ${year}  ${time}`;

  console.log(time);
  const handleUpload = async () => {
    if (!file) return;
    const reportsCollectionRef = collection(db, `reports/${uid}/uploaded`);
    const uniqueKey = doc(reportsCollectionRef).id;
    const storageRef = ref(
      storage,
      `reports/${uid}/uploaded/${uniqueKey}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error("File upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const docRef = doc(reportsCollectionRef, uniqueKey);
        await setDoc(docRef, {
          title,
          category,
          downloadURL,
          uploadDate: dateTimeString,
          comments: [],
        });
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 z-50 bg-white">
      <input type="file" onChange={handleChange} accept="application/pdf" />
      <select
        className="border-2 px-5 py-2 rounded-2xl bg-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="BloodReport">Blood</option>
        <option value="SugarReport">Sugar</option>
        <option value="OtherReport">Other</option>
      </select>
      <input
        className="border-2 px-5 py-2 rounded-2xl bg-white"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Title"
      />
      <div>Upload progress: {progress}%</div>
      <button
        className="border rounded-3xl py-2 font-semibold text-white bg-lightblueButton"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
