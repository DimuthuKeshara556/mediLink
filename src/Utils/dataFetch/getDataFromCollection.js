import { collection, getDocs } from "firebase/firestore";
import db from "../../Firebase/firebase";

const dbData = {};

const getDataFromCollection = (collectionName, setFunc) => {
  if (dbData[collectionName] && dbData[collectionName.length > 0]) {
    setFunc(dbData[collectionName]);
  } else {
    getDocs(collection(db, collectionName)).then((querySnapshot) => {
      const dataArr = [];
      querySnapshot.forEach((doc) => {
        dataArr.push({ ...doc.data(), dataId: doc.id });
      });
      dbData[collectionName]=dataArr;
      setFunc(dataArr);
    });
  }
};
export default getDataFromCollection;