import React, { useContext, useEffect, useRef, useState } from "react";
import { dataContext } from "../App";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "./components/Loading";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginToggle, setLoginToggle] = useState(false);
  const { setToken, api, user, loading } = useContext(dataContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [btnToggle, setBtnToggle] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const inputFocus = useRef(null);
  const navigate = useNavigate();

  // send otp function
  const sendOtpFunction = async (event) => {
    event.preventDefault();
    setBtnToggle(true);
    try {
      const response = await axios.post(`${api}/api/email/send-otp`, {
        email,
        fullName,
      });
      if (response) {
        setLoginToggle(true);
        setBtnToggle(false);
      }
    } catch (error) {
      console.error(error);
      setBtnToggle(false);
    }
  };

  // verifying otp function
  const verifyOtp = async (event) => {
    event.preventDefault();
    setSubmitBtn(true);
    try {
      const response = await axios.post(`${api}/api/email/verify-otp`, {
        email,
        fullName,
        otp,
      });
      if (response) {
        setOtp("");
        // storing token in localStorage
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setToken(response.data.token);
        setSubmitBtn(false);
        setEmail("");
        setFullName("");
        navigate("/")
      }
    } catch (error) {
      console.error(error);
      setOtpError(true);
      setSubmitBtn(false);
    }
  };

  useEffect(() => {
    if (loginToggle) {
      inputFocus.current.focus();
    }
  }, [loginToggle]);

  useEffect(() => {
    if (user.role === "user") {
      toast.success("Logged in successfully. Waiting for admin approval.");
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      <div className="flex justify-center items-center w-screen h-screen">
        {loginToggle ? (
          <>
            {/*enter otp section  */}
            <div className="flex flex-col justify-center w-full p-12">
              <div className="sm:mx-auto  sm:w-full sm:max-w-sm">
                <img
                  className="w-40 rounded-full mx-auto"
                  src="/MadlyMart.png"
                  alt="Your Company"
                />
                <h2 className="mt-7 text-center text-2xl/9 font-semibold tracking-tight text-gray-900">
                  Log in
                </h2>
              </div>
              <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={verifyOtp}>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Enter Login code
                    </label>
                    <span className="text-sm text-gray-500">
                      Sent to <span className="underline">{email}</span>
                    </span>
                    <div className="mt-2">
                      <input
                        ref={inputFocus}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="number"
                        name="otp"
                        id="otp"
                        placeholder="6-digit code"
                        required
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 ${
                          otpError
                            ? "outline-red-500"
                            : "outline-gray-500 focus:outline-indigo-600 "
                        } placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2  number-input sm:text-sm/6 `}
                      />
                    </div>
                    {otpError && (
                      <h5 className="mt-1 text-red-600">Invalid Login code</h5>
                    )}
                  </div>

                  <div>
                    <button
                      disabled={submitBtn ? true : false}
                      type="submit"
                      className={`${
                        submitBtn
                          ? "bg-gray-500 cursor-auto"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      } flex w-full justify-center rounded-md  px-3 py-1.5 text-md/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      {submitBtn ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
                <h5
                  onClick={() => {
                    setLoginToggle(false), setOtpError(false), setOtp("");
                  }}
                  className="text-sm font-semibold mt-4 text-blue-700 cursor-pointer"
                >
                  Log in with a different email
                </h5>
                <p className="mt-2  text-sm/6 text-gray-500">
                  <span className="mr-1">
                    If you didn’t receive the login code, please check your
                    email or
                  </span>
                  <a
                    href="mailto:madlymart@gmail.com"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    contact us
                  </a>
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* send otp section  */}
            <div className="flex flex-col justify-center w-full p-12">
              <div className="sm:mx-auto  sm:w-full sm:max-w-sm">
                <img
                  className="w-40 rounded-full mx-auto"
                  src="/MadlyMart.png"
                  alt="Your Company"
                />
                <h2 className="mt-7 text-center text-2xl/9 font-semibold tracking-tight text-gray-900">
                  Log in
                </h2>
              </div>
              <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={sendOtpFunction}>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="fullName"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Full Name
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        maxLength="9"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        placeholder="Enter your full Name"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-500 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <span className="text-sm text-gray-500">
                      Enter your email and we will send you a login code
                    </span>
                    <div className="mt-2">
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-500 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      disabled={btnToggle && "true"}
                      type="submit"
                      className={`flex w-full justify-center rounded-md ${
                        btnToggle
                          ? "bg-gray-500 cursor-auto"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      } px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      Continue
                    </button>
                  </div>
                </form>
                <p className="mt-5 text-center text-sm/6 text-gray-500">
                  <span className="mr-1">
                    If you didn’t receive the login code, please check your
                    email or
                  </span>
                  <a
                    href="mailto:madlymart@gmail.com"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    contact us
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Login;
