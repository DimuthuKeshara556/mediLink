
import React, { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import getDataFromSubCollection from '../../../../Utils/dataFetch/getDataFromSubCollection';
import db from '../../../../Firebase/firebase';
import fav from '../../../../assets/Icons/favourite-none.svg';
import favFill from '../../../../assets/Icons/favourite-fill.svg';

const DoctorToggle = ({ patientId, doctorId,onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      getDataFromSubCollection('patient', patientId, 'favorites', (data) => {
        const favoriteDoctor = data.find(doc => doc.dataId === doctorId);
        if (favoriteDoctor) {
          setIsFavorite(true);
        }
      });
    };

    checkFavoriteStatus();
  }, [patientId, doctorId]);

  const handleToggleFavorite = async () => {
    const docRef = doc(db, `patient/${patientId}/favorites/${doctorId}`);
    if (isFavorite) {
      await deleteDoc(docRef);
      setIsFavorite(false);
    } else {
      await setDoc(docRef, {});
      setIsFavorite(true);
    }
    onToggle();
  };

  return (
    <img
    className='w-[25px] hover:scale-105'
    onClick={handleToggleFavorite}
    src={isFavorite ? favFill : fav}
    alt=""
  />
  );
};

export default DoctorToggle;
