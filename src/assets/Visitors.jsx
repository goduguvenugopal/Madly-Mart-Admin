import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../App";
import axios from "axios";

const Visitors = () => {
  const { analytics_api } = useContext(dataContext);
  const [totalVisitors, setTotalVisitors] = useState([]);
  const [todayVisitors, setTodayVisitors] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const getTotalVisitors = async () => {
    try {
      setSpinner(true);
      const res = await axios.get(
        `${analytics_api}/analytics/api/get-all-days-visitors`
      );
      if (res) {
        const res_2 = await axios.get(
          `${analytics_api}/analytics/api/get-today-visitors`
        );
        setTodayVisitors(res_2.data.visitors);
        setTotalVisitors(res.data.visitors);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getTotalVisitors();
  }, []);

  //   spinner code
  const Spinner = () => {
    return (
      <div className="flex justify-center items-center  h-10 mt-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-[6.1rem] p-3 lg:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10">
        {/* Today's Visitors */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">
            Today's Visitors
          </h2>
          {spinner ? (
            <Spinner />
          ) : (
            <p className="mt-3 text-4xl font-bold text-blue-600">
              {todayVisitors}
            </p>
          )}
        </div>

        {/* Total Visitors */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Visitors
          </h2>
          {spinner ? (
            <Spinner />
          ) : (
            <p className="mt-3 text-4xl font-bold text-green-600 ">
              {totalVisitors}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mt-10">
        <button
          onClick={getTotalVisitors}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
        >
          Check Again
        </button>
      </div>
    </>
  );
};

export default Visitors;
