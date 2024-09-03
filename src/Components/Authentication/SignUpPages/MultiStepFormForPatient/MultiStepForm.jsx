import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../../../Firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import backgroundImg from "../../../../assets/Images/SignUpBackground.png";
import { Link } from "react-router-dom";
import Success from "../Success";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
    phoneNumber: "",
    bloodGroup: "",
    gender: "",
    email: "",
    height: "",
    weight: "",
    img: "",
    password: "",
  });
  const role = "P";

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
      dob,
      address,
      phoneNumber,
      bloodGroup,
      gender,
      email,
      height,
      weight,
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

      await setDoc(doc(firestore, "patient", user.uid), {
        name,
        dob,
        address,
        phoneNumber,
        bloodGroup,
        gender,
        email,
        height,
        weight,
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
    { number: "02", title: "Medical Information" },
    { number: "03", title: "Account Information" },
    { number: "04", title: "Success" },
  ];

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-around md:justify-center w-full md:h-screen bg-cover bg-center "
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="w-full p-6 md:p-0 md:w-1/4 md:h-[90vh]">
        <p className="text-[22px] font-bold mt-10 md:mb-14">
          Join MediLink as a Patient
        </p>
        <p className="hidden md:flex text-[14px] font-bold mb-6 md:pr-5">
          Sign up today to easily book appointments, connect with top doctors,
          and manage your health from anywhere. Your journey to better
          healthcare starts here!
        </p>
        <ul className="flex flex-row md:flex-col">
          {stepTitles.map((stepTitle, index) => (
            <li
              key={index}
              className={`mb-2 rounded-l-full p-3 ${
                step === index + 1 ? "font-bold md:bg-gray-200" : ""
              }`}
            >
              <p className="hidden md:flex flex-row items-center gap-5">
                {" "}
                <span className="p-2 px-3 bg-white rounded-full">
                  {stepTitle.number}
                </span>
                {stepTitle.title}
              </p>
              <p className="flex md:hidden">
                {" "}
                <span
                  className={` p-2 border-2 w-fit rounded-full  ${
                    step === index + 1
                      ? "font-bold bg-lightblueButton text-white"
                      : ""
                  }`}
                >
                  {stepTitle.number}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-2/5  p-4 md:pl-0">
        {step === 1 && (
          <Step1
            nextStep={nextStep}
            handleChange={handleChange}
            values={formData}
          />
        )}
        {step === 2 && (
          <Step2
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            values={formData}
          />
        )}
        {step === 3 && (
          <Step3
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
export default MultiStepForm;
