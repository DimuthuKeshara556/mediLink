import React, { useEffect, useState } from "react";
import Chat from "../../Massage/Chat";
import { useAuth } from "../../../AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../Firebase/firebase";

const OngoingAppoinment = () => {
  const { uid } = useAuth();
  const { sessionId } = useParams();

  const [docId, setDocId] = useState();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataRef = doc(firestore, "sessions", sessionId);
        const userDataDoc = await getDoc(userDataRef);

        if (userDataDoc.exists()) {
          const userData = userDataDoc.data();
          // console.log(userData);
          setDocId(userData.docId);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchUserData();
  }, [sessionId]);

  return (
    <div className="w-full h-screen flex  justify-end">
      <div className="w-full h-[80vh] md:w-5/6 mt-20 px-10">
        <Chat userId={uid} recipientId={docId} sessionId={sessionId} />
      </div>
    </div>
  );
};

export default OngoingAppoinment;
