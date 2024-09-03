import React, { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../../../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import DoctorStep1 from "./DoctorStep1";
import DoctorStep2 from "./DoctorStep2";
import DoctorStep3 from "./DoctorStep3";
import backgroundImg from "../../../../assets/Images/SignUpBackground.png";
import Success from "../Success";

const MultiStepFormDoctor = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    medicalLicenseNumber: "",
    speciality: "",
    address: "",
    phoneNumber: "",
    gender: "",
    email: "",
    totalPatientNo: "",
    yearOfExperince: "",
    rating: "",
    img: "",
    password: "",
  });
  const role = "D";

  const nextStep = (values) => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      medicalLicenseNumber,
      speciality,
      address,
      phoneNumber,
      gender,
      email,
      totalPatientNo,
      yearOfExperince,
      rating,
      img,
      password,
    } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(firestore, "doctor", user.uid), {
        name,
        medicalLicenseNumber,
        speciality,
        address,
        phoneNumber,
        gender,
        email,
        totalPatientNo,
        yearOfExperince,
        rating,
        img,
      });
      await setDoc(doc(firestore, "users", user.uid), {
        role,
      });
      nextStep();
    } catch (error) {
      console.log(error.code, error.message);
    }
  };

  const stepTitles = [
    { number: "01", title: "Personal Info" },
    { number: "02", title: "Professional Information" },
    { number: "03", title: "Account Information" },
    { number: "04", title: "Success" },
  ];

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-around md:justify-center w-full md:h-screen bg-cover bg-center "
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="w-1/4 h-[90vh]">
        <p className="text-[22px] font-bold mt-10 mb-20">
          Join MediLink as a Doctor
        </p>
        <p className="text-[12px] font-bold mb-4 pr-5">
          Sign up today to connect with patients, expand your practice, and
          provide top-notch care through our innovative platform. Transform your
          healthcare delivery with MediLink!
        </p>
        <ul>
          {stepTitles.map((stepTitle, index) => (
            <li
              key={index}
              className={`mb-2 rounded-l-full p-3 ${
                step === index + 1 ? "font-bold bg-gray-200" : ""
              }`}
            >
              <p>
                {" "}
                <span className="p-2 bg-white w-fit rounded-full mr-5">
                  {stepTitle.number}
                </span>
                {stepTitle.title}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/5  p-4 pl-0">
        {step === 1 && (
          <DoctorStep1
            nextStep={nextStep}
            handleChange={handleChange}
            values={formData}
          />
        )}
        {step === 2 && (
          <DoctorStep2
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        )}
        {step === 3 && (
          <DoctorStep3
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
            onSubmit={onSubmit}
          />
        )}
        {step === 4 && <Success />}
      </div>
    </div>
  );
};
export default MultiStepFormDoctor;
