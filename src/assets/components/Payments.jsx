import React, { useContext, useEffect, useRef, useState } from "react";
import { dataContext } from "../../App";
import { FaSearch } from "react-icons/fa";
import { CustomLoading } from "./Loading";
import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Payments = () => {
  const { payments, paymentspin } = useContext(dataContext);
  const [todayPayments, setTodayPayments] = useState([]);
  const [selectDate, setSelectDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const dateRef = useRef(null);
  const [allPayments, setAllPayments] = useState(false);

  // rendering payments according to the date
  useEffect(() => {
    if (allPayments) {
      setTodayPayments(payments);
    } else {
      const formattedDate = new Date(selectDate).toLocaleDateString("en-GB");
      const remaintodayPayments = payments.filter(
        (item) =>
          new Date(item.createdAt).toLocaleDateString("en-GB") === formattedDate
      );
      setTodayPayments(remaintodayPayments);
    }
  }, [payments, selectDate, allPayments]);

  const dateHandleFunc = (event) => {
    const eventDate = event.target.value;
    setSelectDate(eventDate);
  };

  const handleLabelClick = () => {
    dateRef.current.click();
  };

  // search payments with order id function
  const searchFunction = (e) => {
    const orderId = e.target.value;
    const results = payments.filter((item) =>
      item.mongoOrderId.toLowerCase().includes(orderId.toLowerCase())
    );
    setTodayPayments(results);
  };

  return (
    <div className="mt-[6.1rem] p-3 lg:p-5">
      <h5 className="text-center text-2xl font-semibold mb-3 ">
        All Payments : {todayPayments?.length}
      </h5>
      <hr className="border border-gray-400 mb-5" />
      <div className="mb-2 lg:w-full ">
        <div className="lg:flex lg:justify-center ">
          <div className="relative lg:w-[50%]">
            <input
              type="text"
              placeholder="Search payments with Order Id"
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
          {allPayments ? (
            <button
              onClick={() => setAllPayments(false)}
              className={`border-2 h-10 cursor-pointer hover:bg-blue-500 rounded border-blue-500  px-1 hover:text-white bg-blue-500 text-white`}
            >
              Today Payments
            </button>
          ) : (
            <button
              onClick={() => setAllPayments(true)}
              className={`border-2 h-10 cursor-pointer hover:bg-blue-500 rounded border-blue-500  px-1 hover:text-white `}
            >
              All Payments
            </button>
          )}

          <Link
            to="/failedpayments"
            className={`border-2 h-10 cursor-pointer hover:bg-red-600 rounded border-red-500  px-1 hover:text-white flex justify-center items-center`}
          >
            Failed Payments
          </Link>
        </div>
      </div>
      {/* rendering list of payments*/}
      <div className="pt-2 mt-4 ">
        {paymentspin ? (
          <CustomLoading customHeight="h-[55vh]" />
        ) : (
          <>
            {todayPayments?.length > 0 ? (
              <div className="lg:flex lg:flex-wrap lg:justify-center lg:gap-4 ">
                {todayPayments.map((item) => (
                  <section
                    key={item._id}
                    className="block lg:w-[35%] border bg-gray-200 hover:shadow-gray-400 relative  mb-3 shadow-md rounded shadow-gray-300 p-3"
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
                      Razorpay Signature :{" "}
                      <span className="font-semibold   text-black">
                        {item.razorpay_signature}
                      </span>
                    </h6>
                    <h6 className="text-gray-700 mt-1">
                      Payment Date :{" "}
                      <span className="font-semibold capitalize text-black">
                        {new Date(item.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // 👈 this enables AM/PM
                        })}
                      </span>
                    </h6>

                    <h6 className="text-gray-700 mt-1">
                      Payment Status :{" "}
                      <span
                        className={`font-semibold capitalize ${
                          item.paymentStatus !== "paid"
                            ? "text-white bg-yellow-500 rounded p-1 px-2"
                            : ""
                        }
                    
                     ${
                       item.paymentStatus === "paid"
                         ? "bg-green-600 text-white rounded p-1 px-2"
                         : ""
                     }
                      `}
                      >
                        {item.paymentStatus}
                      </span>
                    </h6>
                  </section>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-[50vh]">
                <h5 className="text-[1.2rem] font-semibold">No payments</h5>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
