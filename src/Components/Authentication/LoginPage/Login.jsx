import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../../Firebase/firebase";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import bgImg from "../../../assets/Images/loginImg.png";
import { useUser } from "../../UserContext/UserContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import defaultProfile from "../../../assets/Icons/defaultProfile.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (emailError) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userId = user.uid;

      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);
      const userRef = doc(firestore, "patient", userId);
      const userDetail = await getDoc(userRef);
      const DocRef = doc(firestore, "doctor", userId);
      const DoctorDetail = await getDoc(userRef);

      let useName;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        if (userDetail.exists() && userRole === "P") {
          const user = userDetail.data();
          useName = user.name;
        } else if (DoctorDetail.exists() && userRole === "D") {
          const doctor = DoctorDetail.data();
          useName = doctor.name;
        }

        const storage = getStorage();
        const imageRef = ref(storage, `${userId}/profile`);
        let imageUrl;

        try {
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          imageUrl = defaultProfile;
        }

        setUser({
          id: userId,
          role: userRole,
          img: imageUrl,
          name: useName,
        });

        if (userRole === "P") {
          navigate("/patient/application");
        } else if (userRole === "D") {
          navigate("/doctor/home");
        } else {
          navigate("/error");
        }
      } else {
        navigate("/error");
        console.log("No such document!");
      }
    } catch (error) {
      navigate("/error");
      console.log("Error signing in:", error.code, error.message);
    }
  };

  return (
    <>
      <main className="w-full flex  items-center justify-center h-screen relative">
        <Link to={"/"}>
          <div className="absolute top-10 right-10">
            <CloseRoundedIcon />
          </div>
        </Link>
        <section className="w-full flex h-screen items-center justify-between p-20 ">
          <div className="hidden md:flex w-1/2  flex-col items-center justify-center gap-10">
            <img
              className="w-[400px] border-2 rounded-3xl shadow-lg"
              src={bgImg}
              alt=""
            />
            <p className="px-14 text-center text-gray-500">
              Access your account to schedule appointments, connect with top
              doctors, and manage your health records seamlessly. Your care,
              just a click away.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex  flex-col items-center">
            <form>
              <p className="font-black mb-5 text-[20px]">
                Welcome Back! <br />
                Log In to Continue Your Health Journey
              </p>
              <div className="flex flex-col gap-2">
                <label htmlFor="email-address">Email</label>
                <input
                  className="border-2 py-2 px-4 rounded-3xl"
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-5">
                <label htmlFor="password">Password</label>
                <input
                  className="border-2 py-2 px-4 rounded-3xl"
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-full flex items-center justify-center mt-10 mb-10">
                <button
                  className="bg-lightblueButton px-10 py-2 font-bold text-white rounded-full w-full hover:scale-105"
                  onClick={onLogin}
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-sm text-black  text-center">
              No account yet?{" "}
              <NavLink to="/signup">
                <span className="text-lightblueButton font-bold hover:text-[15px]">
                  Sign up
                </span>
              </NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
