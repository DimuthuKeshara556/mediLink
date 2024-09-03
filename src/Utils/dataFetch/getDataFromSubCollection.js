import { collection, getDocs } from "firebase/firestore";
import db from "../../Firebase/firebase";

const dbData = {};

const getDataFromSubCollection = (
  collectionName,
  docId,
  subCollectionName,
  setFunc
) => {
  getDocs(
    collection(db, `${collectionName}/${docId}/${subCollectionName}`)
  ).then((querySnapshot) => {
    const dataArr = [];
    querySnapshot.forEach((doc) => {
      dataArr.push({ ...doc.data(), dataId: doc.id });
    });

    setFunc(dataArr);
  });
};
export default getDataFromSubCollection;
