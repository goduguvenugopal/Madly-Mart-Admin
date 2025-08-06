import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CustomLoading } from "./Loading";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { dataContext } from "../../App";
import axios from "axios";

const FailedFailedPayments = () => {
  const { api } = useContext(dataContext);
  const [failedPayments, setFailedPayments] = useState([]);
  const [todayFailedPayments, setTodayFailedPayments] = useState([]);
  const [FailedPaymentspin, setFailedPaymentspin] = useState(true);
  const [selectDate, setSelectDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const dateRef = useRef(null);
  const [allFailedPayments, setAllFailedPayments] = useState(false);

  // fetch failed payments list
  useEffect(() => {
    const fecthFailedPayments = async () => {
      try {
        const res = await axios.get(`${api}/api/payments/get-failed-payments`);
        if (res) {
          console.log(res.data);
          
          setFailedPayments(res.data.failedPayments);
        }
      } catch (error) {
        console.error(error);
      }finally{
        setFailedPaymentspin(false)
      }
    };

    fecthFailedPayments();
  }, []);

  // rendering FailedPayments according to the date
  useEffect(() => {
    if (allFailedPayments) {
      setTodayFailedPayments(failedPayments);
    } else {
      const formattedDate = new Date(selectDate).toLocaleDateString("en-GB");
      const remaintodayFailedPayments = failedPayments.filter(
        (item) =>
          new Date(item.createdAt).toLocaleDateString("en-GB") === formattedDate
      );
      setTodayFailedPayments(remaintodayFailedPayments);
    }
  }, [failedPayments, selectDate, allFailedPayments]);

  const dateHandleFunc = (event) => {
    const eventDate = event.target.value;
    setSelectDate(eventDate);
  };

  const handleLabelClick = () => {
    dateRef.current.click();
  };

  // search FailedPayments with order id function
  const searchFunction = (e) => {
    const orderId = e.target.value;
    const results = failedPayments.filter((item) =>
      item.mongoOrderId.toLowerCase().includes(orderId.toLowerCase())
    );
    setTodayFailedPayments(results);
  };

  return (
    <div className="mt-[6.1rem] p-3 lg:p-5">
      <h5 className="text-center text-2xl font-semibold mb-3 ">
        All FailedPayments : {todayFailedPayments?.length}
      </h5>
      <hr className="border border-gray-400 mb-5" />
      <div className="mb-2 lg:w-full ">
        <div className="lg:flex lg:justify-center ">
          <div className="relative lg:w-[50%]">
            <input
              type="text"
              placeholder="Search FailedPayments with Order Id"
              onChange={searchFunction}
              className="w-full border-2 rounded-full h-[2.5rem] pl-4 border-indigo-500 outline-2 placeholder:text-gray-700 outline-indigo-700 "
            />
            <FaSearch
              size={20}
              className="absolute top-[0.6rem] text-gray-500 right-6"
            />
          </div>
        </div>

      {/* buttons section  */}

        <div className="flex justify-between flex-wrap gap-3 w-full mt-5">
          <div className="relative h-10 w-[7.6rem] cursor-pointer">
            <label
              onClick={handleLabelClick}
              htmlFor="selectDate"
              className="border-2 w-full cursor-pointer h-full rounded border-blue-500 flex items-center justify-between px-1"
            >
              {new Date(selectDate).toLocaleDateString("en-GB")}{" "}
              <IoCalendarOutline size={20} />
            </label>
            <input
              type="date"
              className=" w-full absolute inset-0 opacity-0  h-full cursor-pointer"
              ref={dateRef}
              value={selectDate}
              onChange={dateHandleFunc}
              name="selectDate"
              id="selectDate"
            />
          </div>
          {allFailedPayments ? (
            <button
              onClick={() => setAllFailedPayments(false)}
              className={`border-2 h-10 cursor-pointer hover:bg-blue-500 rounded border-blue-500  px-1 hover:text-white bg-blue-500 text-white`}
            >
              Today FailedPayments
            </button>
          ) : (
            <button
              onClick={() => setAllFailedPayments(true)}
              className={`border-2 h-10 cursor-pointer hover:bg-blue-500 rounded border-blue-500  px-1 hover:text-white `}
            >
              All FailedPayments
            </button>
          )}

          <Link
            to="/payments"
            className={`border-2 h-10 cursor-pointer bg-blue-600 rounded border-blue-500  px-1 text-white flex justify-center items-center`}
          >
            Go back
          </Link>
        </div>
      </div>
      {/* rendering list of FailedPayments*/}
      <div className="pt-2 mt-4 ">
        {FailedPaymentspin ? (
          <CustomLoading customHeight="h-[55vh]" />
        ) : (
          <>
            {todayFailedPayments?.length > 0 ? (
              <div className="lg:flex lg:flex-wrap lg:justify-center lg:gap-4 ">
                {todayFailedPayments.map((item) => (
                  <section
                    key={item._id}
                    className="block lg:w-[35%] border bg-red-100 hover:shadow-gray-400 relative  mb-3 shadow-md rounded shadow-gray-300 p-3"
                  >
                    <h6 className="text-white rounded p-1 px-2 bg-blue-500 w-fit">
                      Payment From :{" "}
                      <span className="font-semibold  text-white">
                        {item.userEmail}
                      </span>
                    </h6>
                    <h6 className="text-gray-700  mt-1">
                      Order Id :{" "}
                      <span className="font-semibold   underline text-black">
                        {item.mongoOrderId}
                      </span>
                    </h6>
                    <h6 className="text-gray-700 mt-1">
                      Total Amount :{" "}
                      <span className="font-semibold capitalize text-black">
                        ₹{item.totalAmount}
                      </span>
                    </h6>

                    <h6 className="text-gray-700 mt-1">
                      Razorepay Payment Id :{" "}
                      <span className="font-semibold   text-black">
                        {item.razorpay_payment_id}
                      </span>
                    </h6>
                    <h6 className="text-gray-700 mt-1">
                      Razorpay Order Id :{" "}
                      <span className="font-semibold   text-black">
                        {item.razorpay_order_id}
                      </span>
                    </h6>
                   
                    <h6 className="text-gray-700 mt-1">
                      Payment Date :{" "}
                      <span className="font-semibold capitalize text-black">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </span>
                    </h6>

                    <h6 className="text-gray-700 mt-1">
                      Payment Status :{" "}
                      <span
                        className="font-semibold capitalize  
                          bg-red-600 text-white rounded p-1 px-2" >
                        {item.paymentStatus}
                      </span>
                    </h6>
                     <h6 className="text-gray-700 mt-1">
                     <details>
                      <summary className="text-[1rem] cursor-pointer text-gray-600 font-bold">See more Reasons</summary>
                      <ul className="text-red-600 font-semibold">
                        <li>Code : {item.error.code}</li>
                        <li>Description : {item.error.description}</li>
                        <li>Source : {item.error.source}</li>
                        <li>Step : {item.error.step}</li>
                        <li>Reason : {item.error.reason}</li>
                      </ul>
                     </details>
                    </h6>
                  </section>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-[50vh]">
                <h5 className="text-[1.2rem] font-semibold">
                  No FailedPayments
                </h5>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FailedFailedPayments;
