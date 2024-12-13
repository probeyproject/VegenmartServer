import React from 'react'
import HeaderTop from "../Components/Header/HeaderTop";
import HeaderMiddle from "../Components/Header/HeaderMiddle";
import HeaderBottom from "../Components/Header/HeaderBottom";
import Footer from '../Components/Common/Footer';



function SignUp() {
  return (
    <div className="container-fluid px-0 overflow-hidden ">
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
          <h2>Sign In</h2>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa-solid fa-house" />
                </a>
              </li>
              <li className="breadcrumb-item active">Sign In</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>



<section className="log-in-section section-b-space">
  <div className="container-fluid-lg w-100">
    <div className="row">
      <div className="col-xxl-6 col-xl-5 col-lg-6 d-lg-block d-none ms-auto">
        <div className="image-contain">
          <img
            src="https://themes.pixelstrap.com/fastkart/assets/images/inner-page/sign-up.png"
            className="img-fluid"
            alt=""
          />
        </div>
      </div>
      <div className="col-xxl-4 col-xl-5 col-lg-6 col-sm-8 mx-auto">
        <div className="log-in-box">
          <div className="log-in-title">
            <h3>Welcome To Fastkart</h3>
            <h4>Create New Account</h4>
          </div>
          <div className="input-box">
            <form className="row g-4">
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    placeholder="First Name"
                  />
                  <label htmlFor="firstname">First Name<span className='text-danger'>*</span></label>
                </div>
                <div className="form-floating theme-form-floating mt-4">
                  <input
                    type="text"
                    className="form-control"
                    id="middlename"
                    placeholder="Middle Name"
                  />
                  <label htmlFor="middlename">Middle Name</label>
                </div>
                <div className="form-floating theme-form-floating mt-4">
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    placeholder="Last Name"
                  />
                  <label htmlFor="lastname">Last Name<span className='text-danger'>*</span></label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email Address"
                  />
                  <label htmlFor="email">Email Address<span className='text-danger'>*</span></label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="Phone no."
                  />
                  <label htmlFor="phone">Phone no.<span className='text-danger'>*</span></label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="file"
                    className="form-control"
                    id="profile"
                    // placeholder="profile"
                  />
                  <label htmlFor="profile">Profile Pic</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                  />
                  <label htmlFor="password">Password<span className='text-danger'>*</span></label>
                </div>
              </div>
              <div className="col-12">
                <div className="forgot-box">
                  <div className="form-check ps-0 m-0 remember-box">
                    <input
                      className="checkbox_animated check-box"
                      type="checkbox"
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      I agree with
                      <span>Terms</span> and <span>Privacy</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <button className="btn btn-animation w-100" type="submit">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
          <div className="other-log-in">
            <h6>or</h6>
          </div>
          <div className="log-in-button">
            <ul>
              <li>
                <a
                  href="https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin"
                  className="btn google-button w-100"
                >
                  <img
                    src="../assets/images/inner-page/google.png"
                    className="blur-up lazyloaded"
                    alt=""
                  />
                  Sign up with Google
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/"
                  className="btn google-button w-100"
                >
                  <img
                    src="../assets/images/inner-page/facebook.png"
                    className="blur-up lazyloaded"
                    alt=""
                  />{" "}
                  Sign up with Facebook
                </a>
              </li>
            </ul>
          </div>
          <div className="other-log-in">
            <h6 />
          </div>
          <div className="sign-up-box">
            <h4>Already have an account?</h4>
            <a href="/login">Log In</a>
          </div>
        </div>
      </div>
      <div className="col-xxl-7 col-xl-6 col-lg-6" />
    </div>
  </div>
</section>

<Footer/>

    </div>
  )
}

export default SignUp