import React, { useEffect, useState } from "react";
import HeaderTop from "../Components/Header/HeaderTop";
import HeaderMiddle from "../Components/Header/HeaderMiddle";
import HeaderBottom from "../Components/Header/HeaderBottom";
import Footer from "../Components/Common/Footer";
import logo from '../assets/images/logo/1.png';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../API/Api";

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const userState = useSelector((state) => state.user);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const isValidMobileNumber = (number) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(number);
  };

  const handleInputChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleGenerateOtp = async () => {
    if (!mobileNumber) {
      toast.warning("Please enter a mobile number!");
      return;
    }

    if (!isValidMobileNumber(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: mobileNumber }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning("Please enter the OTP!");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Invalid OTP. Please enter a 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: mobileNumber, otp: otp }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      dispatch(verifyOTP(data)); // Dispatch the action
      toast.success("OTP verified successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid px-0 overflow-hidden">
      <header className="pb-md-4 pb-0">
        <HeaderTop />
        <HeaderMiddle />
        <HeaderBottom />
      </header>
  
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <h2 className="mb-2">Log In</h2>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="index.html">
                        <i className="fa-solid fa-house" />
                      </a>
                    </li>
                    <li className="breadcrumb-item active">Log In</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <section className="log-in-section background-image-2 section-b-space">
        <div className="container-fluid-lg w-100">
          <div className="row">
            <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
              <div className="image-contain">
                <img
                  src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/log-in.png"
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
              <div className="log-in-box">
                <div className="log-in-title">
                  <h3 className="text-center">Welcome To Vegenmart</h3>
                </div>
                <div className="d-flex justify-content-center align-items-center vh-50">
                  <div
                    className="card p-4 text-center"
                    style={{
                      width: "300px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="mb-4">
                      <img
                        src={logo}
                        alt="Company Logo"
                        style={{ width: "50px" }}
                      />
                    </div>
                    <p>{otpSent ? "Enter OTP" : "Log in or Sign up"}</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                      {!otpSent ? (
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter mobile number"
                            value={mobileNumber}
                            onChange={handleInputChange}
                            maxLength="10"
                          />
                        </div>
                      ) : (
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={handleOtpChange}
                            maxLength="6"
                          />
                        </div>
                      )}
  
                      <button
                        className="btn btn-primary w-100"
                        onClick={otpSent ? handleVerifyOtp : handleGenerateOtp}
                        disabled={loading}
                      >
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : otpSent ? (
                          "Verify OTP"
                        ) : (
                          "Generate OTP"
                        )}
                      </button>
                    </form>
                    <p className="mt-3 text-muted" style={{ fontSize: "12px" }}>
                      By continuing, you agree to our{" "}
                      <a href="/terms">Terms of service</a> &{" "}
                      <a href="/privacy">Privacy policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
  
}

export default Login;
