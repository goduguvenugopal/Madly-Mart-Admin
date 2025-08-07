import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./assets/Navbar.jsx";
import Login from "./assets/Login.jsx";
import { Routes, Route } from "react-router-dom";
import Orders from "./assets/Orders.jsx";
import UploadProducts from "./assets/components/UploadProducts.jsx";
import Admin from "./assets/components/Admin.jsx";
import Products from "./assets/Products.jsx";
import AddCategory from "./assets/components/AddCategory.jsx";
import UploadCarousel from "./assets/components/UploadCarousel.jsx";
import axios from "axios";
import ProductOverView from "./assets/ProductOverView.jsx";
import ProductUpdateForm from "./assets/components/ProductUpdateForm.jsx";
import PageNotFound from "./assets/components/PageNotFound.jsx";
import OrderOverView from "./assets/OrderOverView.jsx";
import AddDiscount from "./assets/components/AddDiscount.jsx";
import Payments from "./assets/components/Payments.jsx";
import FailedPayments from "./assets/components/FailedPayments.jsx";
import Visitors from "./assets/components/Visitors.jsx";

export const dataContext = createContext();

function App() {
  const api = import.meta.env.VITE_API;
  const analytics_api = import.meta.env.VITE_ANALYTICS_API;
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderSpin, setOrderSpin] = useState(false);
  const [reload, setReload] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentSpin, setPaymentSpin] = useState(false);

  useEffect(() => {
    // retrieving token from localstorage
    const token = localStorage.getItem("token");
    if (token) {
      setToken(JSON.parse(token));
    }else{
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    // fetching user details
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${api}/api/user/get-single-user`, {
          headers: {
            token: token,
          },
        });
        if (response) {
          setUser(response.data.singleUser);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // fetch orders
  useEffect(() => {
    const getOrdersFunction = async () => {
      try {
        setOrderSpin(true);
        const res = await axios.get(`${api}/api/order/get-all-orders`);
        if (res) {
          setOrders(res.data.retrievedAllOrders.reverse());
          setOrderSpin(false);
        }
      } catch (error) {
        console.error(error);
        setOrderSpin(false);
      }
    };

    // fecth successfull payments
    const getSuccessfullPayments = async () => {
      try {
        setPaymentSpin(true);
        const res = await axios.get(`${api}/api/payment/get-all-payments`);
        if (res) {
      
          setPayments(res.data.payments);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setPaymentSpin(false);
      }
    };
    // if role is Admin orders function will be called
    if (user.role === "admin") {
      getOrdersFunction();
      getSuccessfullPayments();
    }
  }, [user, reload]);

  return (
    <>
      <dataContext.Provider
        value={{
          token,
          setToken,
          api,
          user,
          setUser,
          loading,
          setLoading,
          orders,
          setOrders,
          orderSpin,
          setOrderSpin,
          reload,
          setReload,
          analytics_api,
          payments,
          paymentSpin,
        }}
      >
        {user.role === "admin" && token && <Navbar />}
        <Routes>
          {user.role === "admin" && token ? (
            <>
              <Route path="/" element={<Orders />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/product_over_view/:id"
                element={<ProductOverView />}
              >
                <Route path="updateproduct" element={<ProductUpdateForm />} />
              </Route>
              <Route path="/admin" element={<Admin />} />
              <Route path="/uploadproducts" element={<UploadProducts />} />
              <Route path="/addcategory" element={<AddCategory />} />
              <Route path="/carousel" element={<UploadCarousel />} />
              <Route path="/discount" element={<AddDiscount />} />
              <Route path="/payments" element={<Payments />} />
              <Route
                path="/order_over_view/:orderId"
                element={<OrderOverView />}
              />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/failedpayments" element={<FailedPayments />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Login />} />
            </>
          )}
        </Routes>
      </dataContext.Provider>
    </>
  );
}

export default App;
