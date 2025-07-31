import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../App";
import cloudinaryFunc from "./coudinary";
import { MdClose } from "react-icons/md";
import { CustomLoading, SmallLoading } from "./Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Maincategories } from "./itemSubCategory";

const AddCategory = () => {
  const { api, token } = useContext(dataContext);
  const [imgLoader, setImgLoader] = useState(false);
  const initialProductData = {
    productCategoryName: "",
    productImage: "",
    available: "",
  };
  const [productData, setProductData] = useState(initialProductData);
  const [addBtnSpinner, setAddBtnSpinner] = useState(false);
  const [btnToggle, setBtnToggle] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [available, setAvailable] = useState("");
  const [spin, setSpin] = useState(false);

  // sending file to cloudinary function
  const fileHandleFunc = async (file) => {
    try {
      setImgLoader(true);
      const imageUrl = await cloudinaryFunc(file);
      if (imageUrl) {
        setProductData((prevData) => ({
          ...prevData,
          productImage: imageUrl,
        }));
        setImgLoader(false);
      }
    } catch (error) {
      console.log(error);
      setImgLoader(false);
    }
  };

  // remove product images function
  const removeImageFunction = () => {
    setProductData({
      productImage: "",
    });
  };

  //product form Handle function
  const formHandleFunc = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // form Submit function
  const formSubmitFunc = async (event) => {
    event.preventDefault();
    setAddBtnSpinner(true);
    try {
      const res = await axios.post(
        `${api}/api/category/save-category-products`,
        productData,
        {
          headers: {
            token: token,
          },
        }
      );
      if (res) {
        toast.success("New product category added successfully");
        setAddBtnSpinner(false);
        setProductData(initialProductData);
      }
    } catch (error) {
      console.error(error);
      toast.success("Not added try again ");
      setAddBtnSpinner(false);
    }
  };

  // updating category availability
  const updateCategoryFunc = async (selectedData) => {
    if (!available) {
      toast.error("Please select the options");
    } else {
      try {
        setSpin(true);
        const res = await axios.put(
          `${api}/api/category/update-category-products/${updateId}`,
          selectedData,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          toast.success("Updated sucessfully");
          setUpdateId("");
          setSpin(false);
        }
      } catch (error) {
        console.error(error);
        toast.success("Please try again not updated ");
        setSpin(false);
      }
    }
  };

  useEffect(() => {
    // fecthing category products data
    const fetchCategoryData = async () => {
      try {
        const res = await axios.get(`${api}/api/category/get-category-products`);
        if (res) {
          setCategoryData(res.data.retrievedProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (!btnToggle) {
      fetchCategoryData();
    }
  }, [btnToggle, updateId]);

  // delete category products
  const deleteCategoryFunc = async (categoryId) => {
    const isOkay = confirm(
      "Category will be deleted permanently, are you sure ?"
    );
    if (isOkay) {
      try {
        const res = await axios.delete(
          `${api}/api/category/delete-category-products/${categoryId}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          toast.success("Category product deletd successfully");
          const remainCategories = categoryData.filter(
            (item) => item._id !== categoryId
          );
          setCategoryData(remainCategories);
        }
      } catch (error) {
        console.error(error);
        toast.error("Category product not deletd try again");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
        <h5 className="text-center text-[1.2rem]  font-semibold">
          Add Category & Update
        </h5>
        <hr className="border  border-gray-200 mb-2 mt-1" />

        <div className="flex justify-around pb-3">
          <h5
            onClick={() => setBtnToggle(true)}
            className={`cursor-pointer font-semibold select-none ${
              btnToggle
                ? "border-b-[3px] w-16 text-center border-b-blue-700 py-1"
                : "py-1 border-b-[3px] w-16 text-center border-b-white"
            }`}
          >
            Add
          </h5>
          <h5
            onClick={() => setBtnToggle(false)}
            className={`cursor-pointer font-semibold select-none ${
              !btnToggle
                ? "border-b-[3px] w-16 text-center border-b-green-600 py-1"
                : "py-1 border-b-[3px] w-16 text-center border-b-white"
            }`}
          >
            Update
          </h5>
        </div>
        <hr className="border border-dashed border-gray-400 mb-5" />

        {/* conditional rendering sections  */}
        {btnToggle ? (
          <>
            {/* form section  */}
            <form
              className="lg:flex lg:justify-between lg:gap-3"
              onSubmit={formSubmitFunc}
            >
              <div className=" lg:w-[40vw]">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product photo <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {imgLoader ? (
                      <div className="flex items-center gap-3 h-[5rem] font-semibold text-gray-700">
                        <SmallLoading /> Uploading...
                      </div>
                    ) : (
                      <svg
                        className="mx-auto size-20 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}

                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="itemImage"
                        className="relative cursor-pointer text-indigo-500 hover:bg-indigo-600 hover:border-white select-none hover:text-white border-2 border-indigo-500 p-1 rounded-md bg-white font-semibold "
                      >
                        <span>Upload a Product photo</span>
                        <input
                          id="itemImage"
                          name="itemImage"
                          type="file"
                          required
                          onChange={fileHandleFunc}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {productData.productImage && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="w-[6.5rem] lg:w-[9.5rem]  relative h-fit rounded">
                      <img
                        src={productData.productImage}
                        className="rounded"
                        alt="item-image"
                      />
                      <MdClose
                        onClick={removeImageFunction}
                        className="rounded-full cursor-pointer h-6 w-6 p-1 absolute top-1 hover:bg-indigo-700 right-1 bg-black text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-12 lg:w-[50vw]">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="productCategoryName"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Product Category Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        value={productData.productCategoryName}
                        onChange={formHandleFunc}
                        required
                        name="productCategoryName"
                        id="productCategoryName"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option disabled value="">
                          Select the options
                        </option>
                        {Maincategories.map((item, index) => (
                          <option
                            key={index}
                            className={`capitalize ${
                              item === "non-veg" && "hidden"
                            }`}
                            value={item}
                          >
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

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="itemWeight"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Select the Product availability{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        required
                        onChange={formHandleFunc}
                        id="available"
                        value={productData.available}
                        name="available"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option disabled value="">
                          Select the options
                        </option>
                        <option value="no">Not Available</option>
                        <option value="yes">Available</option>
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

                  <div className="sm:col-span-4 mt-6 flex items-center justify-center gap-x-6">
                    {addBtnSpinner ? (
                      <button
                        disabled={true}
                        type="button"
                        className="flex cursor-not-allowed items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-2 w-full md:w-fit lg:w-full text-sm font-semibold text-white shadow-sm "
                      >
                        <SmallLoading /> Adding New Category...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 w-full md:w-fit lg:w-full text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add New Category
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* category update section  */}
            {categoryData.length <= 0 ? (
              <CustomLoading customHeight="h-[50vh]" />
            ) : (
              <div className="lg:flex lg:justify-center lg:flex-wrap lg:gap-2">
                {categoryData.map((item) => (
                  <div
                    className="flex border relative items-start gap-3 mb-3 shadow-md rounded shadow-gray-300 p-2 lg:w-2/4"
                    key={item._id}
                  >
                    <img
                      className="w-[6rem] rounded lg:w-[9rem]"
                      src={item.productImage}
                      alt="image"
                    />
                    <div>
                      <h5>
                        Category :{" "}
                        <span className="font-semibold capitalize">
                          {item.productCategoryName}
                        </span>
                      </h5>
                      <h6>
                        Available :{" "}
                        <span className="font-semibold capitalize">
                          {item.available}
                        </span>
                      </h6>
                    </div>
                    <FaEdit
                      onClick={() => setUpdateId(item._id)}
                      size={20}
                      className="text-blue-600 hover:text-green-600 cursor-pointer absolute right-3"
                    />
                    <RiDeleteBin6Line
                      onClick={() => deleteCategoryFunc(item._id)}
                      size={20}
                      className="hover:text-red-600 cursor-pointer absolute right-3 top-11 text-gray-600"
                    />
                  </div>
                ))}

                {/* category update modal  */}
                {updateId && (
                  <div className="fixed  top-0 left-0 bg-gray-700 bg-opacity-75 flex h-screen w-screen items-center justify-center p-10">
                    <div className="bg-white p-3 rounded w-[300px] ">
                      <h5 className="text-[1.1rem] font-semibold">
                        Select the category options
                      </h5>
                      <select
                        onChange={(e) => setAvailable(e.target.value)}
                        value={available}
                        className="border-2 border-blue-600 mt-3 rounded w-full h-10"
                      >
                        <option disabled value="">
                          Select the options
                        </option>
                        <option value="no">Not Available</option>
                        <option value="yes">Available</option>
                      </select>
                      {spin ? (
                        <button className="bg-black mt-5 w-full text-white rounded p-2 flex items-center gap-2 justify-center">
                          <SmallLoading /> Updating...
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            updateCategoryFunc({ available: available })
                          }
                          className="bg-black mt-5 w-full text-white rounded hover:bg-blue-500 p-2"
                        >
                          Update
                        </button>
                      )}

                      <button
                        onClick={() => setUpdateId("")}
                        className="bg-red-600 mt-3 w-full text-white rounded hover:bg-red-700 p-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AddCategory;
