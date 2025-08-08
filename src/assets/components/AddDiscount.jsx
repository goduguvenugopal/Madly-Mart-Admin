import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../../App";
import { CustomLoading, Loading, SmallLoading } from "../components/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const AddDiscount = () => {
  const { api, token } = useContext(dataContext);
  const initialProductData = {
    discount: Number,
    adsPopUp: "",
    couponCode: "",
    deliveryCharges: Number,
  };

  const [productData, setProductData] = useState(initialProductData);
  const [addBtnSpinner, setAddBtnSpinner] = useState(false);
  const [btnToggle, setBtnToggle] = useState(true);
  const [carouselData, setCarouselData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [spin, setSpin] = useState(false);
  const [getCarSpin, setGetCarSpin] = useState(false);
  const [updateCarouselData, setUpdateCarouselData] = useState({});
  const updateProductData = {
    discount: Number,
    adsPopUp: "",
    couponCode: "",
    deliveryCharges: Number,
  };
  const [updateData, setUpdateData] = useState(updateProductData);

  useEffect(() => {
    // fecthing discounts
    const fetchcarouselData = async () => {
      setGetCarSpin(true);
      try {
        const res = await axios.get(`${api}/api/offer/get-offer`);
        if (res) {
          setGetCarSpin(false);
          setCarouselData(res.data.offers);
          setUpdateCarouselData(res.data.offers[0]);
        }
      } catch (error) {
        console.error(error);
        setGetCarSpin(false);
      }
    };
    if (!btnToggle) {
      fetchcarouselData();
    }
  }, [btnToggle, updateId]);

  useEffect(() => {
    if (updateCarouselData) {
      if (Object.keys(updateCarouselData).length > 0) {
        setUpdateData((prevData) => ({
          ...prevData,
          discount: updateCarouselData.discount,
          adsPopUp: updateCarouselData.adsPopUp,
          couponCode: updateCarouselData.couponCode,
          deliveryCharges: updateCarouselData.deliveryCharges,
        }));
      }
    }
  }, [updateCarouselData]);

  // update form handle function
  const updateHandleFunc = (event) => {
    const { name, value } = event.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        `${api}/api/offer/create-offer`,
        productData,
        {
          headers: {
            token: token,
          },
        }
      );
      if (res) {
        toast.success("Discounts added successfully");
        setAddBtnSpinner(false);
        setProductData(initialProductData);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 409) {
        toast.error(
          "Discount already added, before adding new discount delete old discounts"
        );
        setAddBtnSpinner(false);
      } else {
        toast.error("Not added try again ");
        setAddBtnSpinner(false);
      }
    }
  };

  // updating discounts function
  const updateCarouselFunc = async () => {
    try {
      setSpin(true);
      const res = await axios.put(
        `${api}/api/offer/update-offer/${updateId}`,
        updateData,
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
        setUpdateData(updateProductData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again not updated ");
      setSpin(false);
    }
  };

  // delete discounts function
  const deleteCarouselFunc = async (carouselId) => {
    const isOkay = confirm(
      "Offer images and title will be deleted permanently, are you sure ?"
    );
    if (isOkay) {
      try {
        const res = await axios.delete(
          `${api}/api/carousel/delete-carousel/${carouselId}`
        );
        if (res) {
          toast.success("offer & title images deletd successfully");
          const remainCategories = carouselData.filter(
            (item) => item._id !== carouselId
          );
          setCarouselData(remainCategories);
        }
      } catch (error) {
        console.error(error);
        toast.error("offer images not deletd try again");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
        <h5 className="text-center text-[1.2rem]  font-semibold">
          Add Discount & Update
        </h5>
        <hr className="border  border-gray-200 mb-4 mt-1" />

        <div className="flex justify-around pb-3">
          <h5
            onClick={() => setBtnToggle(true)}
            className={` hover:border-blue-700 cursor-pointer font-semibold select-none ${
              btnToggle
                ? "bg-blue-500 text-white font-semibold rounded-full w-16 text-center border border-blue-500   py-1"
                : "py-1  text-black font-semibold rounded-full border border-gray-400 w-16 text-center  "
            }`}
          >
            Add
          </h5>
          <h5
            onClick={() => setBtnToggle(false)}
            className={`hover:border-blue-700 cursor-pointer font-semibold select-none ${
              !btnToggle
                ? " w-20 text-center bg-blue-500 text-white font-semibold rounded-full   border border-blue-500  py-1"
                : "py-1   w-20 text-center  text-black font-semibold rounded-full border border-gray-400 "
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
            <div className="lg:flex lg:justify-between lg:gap-3">
              <div className=" lg:w-[40vw]">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="discount"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Discount
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="discount"
                        id="discount"
                        value={productData.discount}
                        onChange={formHandleFunc}
                        placeholder="Enter the discount amount"
                        className="block number-input w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="adsPopUp"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Ads PopUp
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="adsPopUp"
                        id="adsPopUp"
                        value={productData.adsPopUp}
                        onChange={formHandleFunc}
                        placeholder="Enter on or off to show the ads "
                        className="block number-input w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-12 lg:w-[50vw]">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="couponCode"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Coupon Code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="couponCode"
                        id="couponCode"
                        value={productData.couponCode}
                        onChange={formHandleFunc}
                        placeholder="Enter the coupon code for discount"
                        className="block w-full number-input rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="deliveryCharges"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Delivery Charges
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="deliveryCharges"
                        id="deliveryCharges"
                        value={productData.deliveryCharges}
                        onChange={formHandleFunc}
                        placeholder="Enter delivery Charges"
                        className="block w-full number-input rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 mt-6 flex items-center justify-center gap-x-6">
                    {addBtnSpinner ? (
                      <button
                        disabled={true}
                        type="button"
                        className="flex cursor-not-allowed items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-2 w-full md:w-fit lg:w-full text-sm font-semibold text-white shadow-sm "
                      >
                        <SmallLoading /> Adding Discount...
                      </button>
                    ) : (
                      <button
                        onClick={formSubmitFunc}
                        className="rounded-md bg-indigo-600 px-3 py-2 w-full md:w-fit lg:w-full text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* update section  */}
            {getCarSpin ? (
              <CustomLoading customHeight="h-[50vh]" />
            ) : (
              <>
                {carouselData.length <= 0 ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <h5 className="font-semibold">No discounts & charges</h5>
                  </div>
                ) : (
                  <div>
                    {carouselData.map((item) => (
                      <div
                        className="font-semibold flex relative flex-col border  items-start gap-3 mb-3 p-3 rounded"
                        key={item._id}
                      >
                        <span className="mt-2 ">
                          Ads Pop Up :{" "}
                          <span className="text-blue-700">{item.adsPopUp}</span>
                        </span>

                        <span className="mt-2 ">
                          Coupon Code :{" "}
                          <span className="text-blue-700">
                            {item.couponCode}
                          </span>
                        </span>
                        <span className="mt-2 ">
                          Discount :{" "}
                          <span className="text-blue-700">{item.discount}</span>
                        </span>
                        <span className="mt-2 ">
                          Delivery Charges :{" "}
                          <span className="text-blue-700">
                            {item.deliveryCharges}
                          </span>
                        </span>

                        <FaEdit
                          onClick={() => setUpdateId(item._id)}
                          size={20}
                          className="text-green-600 hover:text-blue-600 cursor-pointer absolute top-4 right-4"
                        />
                        {/* <RiDeleteBin6Line onClick={() => deleteCarouselFunc(item._id)} size={20} className='hover:text-red-600 cursor-pointer   text-gray-600' /> */}
                      </div>
                    ))}

                    {/* carousel update section  */}
                    {updateId && (
                      <div className="">
                        <h5 className="text-center font-semibold text-[1.2rem] text-gray-700">
                          Update discount & charges
                        </h5>
                        <hr className="border border-dashed border-black mt-2" />

                        <div className="lg:flex lg:justify-between lg:gap-3">
                          <div className=" lg:w-[40vw]">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="discount"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  discount
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="number"
                                    name="discount"
                                    id="discount"
                                    value={updateData.discount}
                                    onChange={updateHandleFunc}
                                    placeholder="Enter discount"
                                    className="block number-input w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="adsPopUp"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  Ads Pop up
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="string"
                                    name="adsPopUp"
                                    id="adsPopUp"
                                    value={updateData.adsPopUp}
                                    onChange={updateHandleFunc}
                                    placeholder="Enter on and of to show the ads pop up"
                                    className="block number-input w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                              </div>
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="couponCode"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  Coupon Code
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="string"
                                    name="couponCode"
                                    id="couponCode"
                                    value={updateData.adsPopUp}
                                    onChange={updateHandleFunc}
                                    placeholder="Enter on and of to show the ads pop up"
                                    className="block number-input w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-12 lg:w-[50vw]">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="deliveryCharges"
                                  className="block text-sm/6 font-medium text-gray-900"
                                >
                                  Delivery Charges
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="number"
                                    name="deliveryCharges"
                                    id="deliveryCharges"
                                    value={updateData.deliveryCharges}
                                    onChange={updateHandleFunc}
                                    placeholder="Enter delivery Charges"
                                    className="block w-full number-input rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr className="border mt-2" />

                        <div className="flex flex-wrap items-center pt-5 justify-around gap-2">
                          <button
                            onClick={() => setUpdateId("")}
                            className="bg-red-600  order-2 lg:order-1 w-full lg:w-[40%] text-white rounded hover:bg-red-700  h-10"
                          >
                            Close
                          </button>

                          {spin ? (
                            <button className="bg-black order-1 lg:order-2 w-full lg:w-[40%] text-white rounded p-2 flex items-center gap-2 justify-center">
                              <SmallLoading /> Updating...
                            </button>
                          ) : (
                            <button
                              onClick={updateCarouselFunc}
                              className="bg-black order-1 lg:order-2  w-full lg:w-[40%] text-white rounded hover:bg-blue-500 p-2 "
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AddDiscount;
