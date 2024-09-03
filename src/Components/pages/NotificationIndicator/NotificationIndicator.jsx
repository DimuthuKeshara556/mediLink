import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useUser } from "../../UserContext/UserContext";
import db from "../../../Firebase/firebase";

const NotificationIndicator = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useUser();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setNotificationCount(0);
  };

  useEffect(() => {
    const appointmentRef = collection(
      db,
      `appointments/${user.id}/appointments`
    );
    const q = query(appointmentRef, where("status", "==", "In Progress"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        const notification = {
          id: doc.id,
          message: `Appointment ${
            doc.data().time
          } is now in progress. Please join.`,
          sessionId: doc.data().sessionId,
        };
      });

      if (newNotifications.length > 0) {
        setNotificationCount(
          (prevCount) => prevCount + newNotifications.length
        );
      }
    });

    return () => unsubscribe();
  }, [user.id]);

  return (
    <div className="relative">
      <div className="relative" onClick={toggleNotifications}>
        {notificationCount > 0 && (
          <div className="bg-red-600 text-white text-xs font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
            {notificationCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationIndicator;
