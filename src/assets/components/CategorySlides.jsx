import React from "react";
import { MdClose } from "react-icons/md";
import {Maincategories} from "../data"

const CategorySlides = () => {
  return (
    <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
      <div className="w-full flex flex-col md:flex-row gap-5 md:items-center md:justify-around">
        <div className="md:w-1/2">
          <label
            htmlFor="productCategoryName"
            className="block text-sm/6 md:text-[1rem] font-medium text-gray-900"
          >
          Select Category for Slides 
          </label>
          <div className="mt-2 grid grid-cols-1">
            <select
              required
              name="productCategoryName"
              id="productCategoryName"
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option disabled value="">
                Select the options
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

        <div className=" md:w-1/3">
        <h5 className="text-gray-800 mb-3 font-semibold">Selected Categories</h5>
          <div className=" flex justify-around items-center gap-3 bg-blue-900 text-white rounded-full px-3 h-8">
            <MdClose className="cursor-pointer" size={19} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySlides;
