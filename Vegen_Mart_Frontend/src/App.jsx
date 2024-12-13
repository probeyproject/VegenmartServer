import React, { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./Protected/ProtectedRoute";
import { useDispatch } from "react-redux";
import { checkAuthentication } from "./slices/userSlice";

// Lazy loading components
const Index = lazy(() => import("./Pages/Index"));
const FilterPage = lazy(() => import("./Pages/FilterPage"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const About = lazy(() => import("./Pages/About"));
const Faq = lazy(() => import("./Pages/Faq"));
const Order = lazy(() => import("./Pages/Order"));
const Tracking = lazy(() => import("./Pages/Tracking"));
const Login = lazy(() => import("./Pages/Login"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const Account = lazy(() => import("./Pages/Account"));
const Page404 = lazy(() => import("./Pages/Page404"));
const Whislist = lazy(() => import("./Pages/Whislist"));
const Cart = lazy(() => import("./Pages/Cart"));
const DetailPage = lazy(() => import("./Pages/DetailPage"));
const BannerProductDetails = lazy(() => import("./Pages/BannerProductDetails"));
const OtpVerify = lazy(() => import("./Pages/OtpVerify"));
const KumbhInfo = lazy(() => import("./Pages/KumbhInfo"));
const BusinessInfo = lazy(() => import("./Pages/BusinessInfo"));
const ProductList = lazy(() => import("./Components/Header/ProductList"));
const MyInvoice = lazy(() => import("./Pages/MyInvoice"));

// Skeleton Loader as a fallback
const SkeletonLoader = () => (
  <div
    className="skeleton-loader d-flex justify-content-center align-items-center"
    style={{ height: "100vh" }}
  >
    <div className="text-center">
      <div className="spinner-grow text-danger" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(checkAuthentication());
    };

    checkAuth();
  }, [dispatch]);

  const { user, authenticated, cart, wishlists, rewards } = useSelector(
    (state) => state.user
  );

  useEffect(() => {}, [user, authenticated, cart, wishlists, rewards]); // Run effect when these values change

  return (
    <Router>
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/order" element={<Order />} />
          <Route path="/tracking/:orderId" element={<Tracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myaccount" element={<Account />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/mywhishlist" element={<Whislist />} />
          {/* <ProtectedRoute path="/cart" element={<Cart />} /> */}
          {/* <Route path="/cart" element={<Cart />}/> */}
          <Route path="/detail_page/:id" element={<DetailPage />} />
          <Route
            path="/bannerProductDetails"
            element={<BannerProductDetails />}
          />
          <Route path="/otpverify" element={<OtpVerify />} />
          <Route path="/kumbhinfo" element={<KumbhInfo />} />
          <Route path="/businessInfo" element={<BusinessInfo />} />
          <Route path="/filters/:query" element={<ProductList />} />
          <Route path="/myInvoice/:orderId" element={<MyInvoice />} />
        </Routes>
      </Suspense>
      <ToastContainer autoClose={1000} />
    </Router>
  );
}

export default App;
