import React, { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { Maincategories } from "../data";
import axios from "axios";
import { dataContext } from "../../App";
import { toast, ToastContainer } from "react-toastify";

const CategorySlides = () => {
  const { api, token } = useContext(dataContext);
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [categorySlides, setCategorySlides] = useState({});
  const [loader, setLoader] = useState(true);
  const [spin, setSpin] = useState(false);

  // fetch category slides
  const getCateSlides = async () => {
    try {
      const res = await axios.get(`${api}/api/get-category-slides`);
      if (res) {
        setCategorySlides(
          res.data?.categorySlides === null ? [] : res.data?.categorySlides
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCateSlides();
  }, []);

  useEffect(() => {
    if (categorySlides?.categorySlides?.length <= 0) {
      setSelectedSlides([]);
    } else if (categorySlides?.categorySlides?.length >= 1) {
      setSelectedSlides(categorySlides?.categorySlides);
    }
  }, [categorySlides]);

  // select category input handler
  const selectCategorySlides = (e) => {
    const selectedInput = e.target.value;
    if (!selectedSlides?.includes(selectedInput)) {
      setSelectedSlides([...selectedSlides, selectedInput]);
    }
  };


  // update category slides
  const updateCategorySlides = async () => {
    try {
      setSpin(true);
      let res;
      if (!categorySlides?._id) {
        res = await axios.post(
          `${api}/api/add-category-slides`,
          { categorySlides: selectedSlides },
          {
            headers: {
              token: token,
            },
          }
        );
      } else {
        res = await axios.put(
          `${api}/api/update-category-slides/${categorySlides._id}`,
          { categorySlides: selectedSlides },
          {
            headers: {
              token: token,
            },
          }
        );
      }

      if (res) {
        toast.success("updated successfully");
        getCateSlides();
      }
    } catch (error) {
      console.error(error);
      if (error.response.data.message && error) {
        if (error.status === 400) {
          toast.warn(error.response.data.message);
        }
      } else {
        toast.error("please try again not updated");
      }
    } finally {
      setSpin(false);
    }
  };

  // remove category slides
  const removeCateSlides = (cate) => {
    const filtered = selectedSlides.filter((item) => item !== cate);
    setSelectedSlides(filtered);
  };

  if (loader) {
    return (
      <div className="flex h-screen font-bold text-[1rem] justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
      <ToastContainer position="top-center" theme="dark" />
        <h5 className="text-center text-[1.2rem]  font-semibold">
          Add Category Slides & Update
        </h5>
        <hr className="border  border-gray-200 mb-2 mt-1" />

      <div className="mt-5 w-full flex flex-col md:flex-row gap-5 md:justify-around">
        <div className="md:w-1/2">
          {/* all categories drop down  */}
          <label
            htmlFor="category"
            className="block text-sm/6 md:text-[1rem] font-medium text-gray-900"
          >
            Select Category for Slides
          </label>
          <div className="mt-2 grid grid-cols-1">
            <select
              required
              name="category"
              onChange={selectCategorySlides}
              id="category"
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option disabled value="">
                Select the category
              </option>
              {Maincategories?.map((item, index) => (
                <option key={index} className={`capitalize `} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* render category slides list  */}
        <div className=" md:w-1/3">
          <h5 className="text-gray-800 mb-3 font-semibold">
            Selected Categories
          </h5>
          <ol className="flex flex-col gap-3">
            {selectedSlides?.map((cate, index) => (
              <li
                key={index}
                className=" flex justify-between items-center gap-3 bg-blue-900 text-white rounded-full px-3 h-8"
              >
                {index + 1}. {cate}
                <MdClose onClick={()=> removeCateSlides(cate)} className="cursor-pointer" size={19} />
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="text-center mt-5 pt-5  border-t border-gray-400">
        {spin ? (
          <button className="bg-blue-500 hover:bg-blue-600 font-semibold py-1 text-white rounded w-1/3">
            Submitting...
          </button>
        ) : (
          <button
            onClick={updateCategorySlides}
            className="bg-blue-500 hover:bg-blue-600 font-semibold py-1 text-white rounded w-1/3"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySlides;
