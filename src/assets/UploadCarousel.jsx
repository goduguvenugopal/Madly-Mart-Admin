import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../App";
import cloudinaryFunc from "./coudinary";
import { MdClose } from "react-icons/md";
import { CustomLoading, Loading, SmallLoading } from "./Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const UploadCarousel = () => {
  const { api, token } = useContext(dataContext);
  const [delLoader, setDelLoader] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [offerTitle, setOfferTitle] = useState("");
  const [updateOfferTitle, setUpdateOfferTitle] = useState("");
  const [addBtnSpinner, setAddBtnSpinner] = useState(false);
  const [btnToggle, setBtnToggle] = useState(true);
  const [carouselData, setCarouselData] = useState([]);
  const [updateId, setUpdateId] = useState("");
  const [spin, setSpin] = useState(false);
  const [getCarSpin, setGetCarSpin] = useState(false);
  const [updateCarouselData, setUpdateCarouselData] = useState({});
  const [updatePrevImg, setUpdatePrevImg] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);

  useEffect(() => {
    // fecthing carousel images data
    const fetchcarouselData = async () => {
      setGetCarSpin(true);
      try {
        const res = await axios.get(`${api}/api/carousel/get-carousel`);
        if (res) {
          setGetCarSpin(false);
          setCarouselData(res.data?.retrievedCarousel);
          setUpdateCarouselData(res.data?.retrievedCarousel[0]);
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
    if (updateCarouselData?.offerTitle || updateCarouselData?.carouselImage) {
      if (Object.keys(updateCarouselData)?.length > 0) {
        setUpdateOfferTitle(updateCarouselData?.offerTitle);
        setUpdatePrevImg(updateCarouselData?.carouselImage);
      }
    }
  }, [updateCarouselData]);

  // update section carousel file handling
  const updateFileHandleFunc = (event) => {
    const filesArray = Array.from(event.target.files);
    const newMappedArray = filesArray.map((file) => ({
      file,
      image: URL.createObjectURL(file),
    }));

    setUpdatePrevImg((prevImg) => [...prevImg, ...newMappedArray]);
  };

  //update section  removing existed offer images
  const removeExistedImageFunc = (itemId) => {
    const remainData = updatePrevImg?.filter((item) => item.image !== itemId);
    setUpdatePrevImg(remainData);
    const filteredIds = remainData
      .filter((item) => item.public_id)
      .map((id) => id.public_id);
    setImagesToKeep(filteredIds);
  };

  //   files handling
  const fileHandleFunc = (e) => {
    const filesArray = Array.from(e.target.files);
    const imageUrls = filesArray.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPreviewImages((prev) => [...prev, ...imageUrls]);
  };

  // remove product images function
  const removeImageFunction = (itemImgUrl) => {
    const remainingObjFile = previewImages.filter(
      (file) => file.previewUrl !== itemImgUrl
    );
    setPreviewImages(remainingObjFile);
  };

  // form Submit function
  const formSubmitFunc = async (event) => {
    event.preventDefault();
    setAddBtnSpinner(true);

    // sending form data
    const formData = new FormData();
    formData.append("offerTitle", offerTitle);
    previewImages.forEach((img) => formData.append("images", img.file));

    try {
      const res = await axios.post(
        `${api}/api/carousel/save-carousel`,
        formData,
        {
          headers: {
            token: token,
          },
        }
      );
      if (res) {
        toast.success("Offer images added successfully");
        setPreviewImages([]);
        setOfferTitle("");
        setAddBtnSpinner(false);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        toast.error(
          "Offer images already added, before adding new Offer images delete old Offer images"
        );
        setAddBtnSpinner(false);
      } else {
        toast.error("Not added try again ");
        setAddBtnSpinner(false);
      }
    }
  };

  // updating category availability
  const updateCarouselFunc = async () => {
    const formData = new FormData();
    formData.append("offerTitle", updateOfferTitle);
    formData.append("imagesToKeep", imagesToKeep);
    updatePrevImg.forEach((img) => formData.append("images", img.file));
    try {
      setSpin(true);
      const res = await axios.put(
        `${api}/api/carousel/update-carousel/${updateId}`,
        formData,
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
      toast.error("Please try again not updated ");
      setSpin(false);
    }
  };

  // delete carousel
  const deleteCarouselFunc = async (carouselId) => {
    const isOkay = confirm(
      "Offer images and title will be deleted permanently, are you sure ?"
    );
    if (isOkay) {
      try {
        setDelLoader(true);
        const res = await axios.delete(
          `${api}/api/carousel/delete-carousel/${carouselId}`,
          {
            headers: {
              token: token,
            },
          }
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
      } finally {
        setDelLoader(false);
      }
    }
  };

  return (
    <>
      {delLoader && (
        <>
          <Loading />{" "}
        </>
      )}
      <ToastContainer position="top-center" theme="dark" />
      <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
        <h5 className="text-center text-[1.2rem]  font-semibold">
          Add Offer Image & Update
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
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Offer images
                </label>
                <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
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

                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="carouselImage"
                        className="relative cursor-pointer text-indigo-500 hover:bg-indigo-600 hover:border-white select-none hover:text-white border-2 border-indigo-500 p-1 rounded-md bg-white font-semibold "
                      >
                        <span>Upload Offer Images</span>
                        <input
                          id="carouselImage"
                          name="carouselImage"
                          type="file"
                          multiple
                          onChange={fileHandleFunc}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {previewImages && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {previewImages.map((item, index) => (
                      <div
                        key={index}
                        className="w-[6.5rem] lg:w-[9.5rem]  relative h-fit rounded"
                      >
                        <img
                          src={item.previewUrl}
                          className="rounded"
                          alt="item-image"
                        />
                        <MdClose
                          onClick={() => removeImageFunction(item.previewUrl)}
                          className="rounded-full cursor-pointer h-6 w-6 p-1 absolute top-1 hover:bg-indigo-700 right-1 bg-black text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-12 lg:w-[50vw]">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="offerTitle"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Offer Title
                    </label>
                    <div className="mt-2">
                      <textarea
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        name="offerTitle"
                        id="offerTitle"
                        rows={3}
                        placeholder="Write offer title Ex : festival offer 20 % discount on each product"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                        <SmallLoading /> Adding Offer Images...
                      </button>
                    ) : (
                      <button
                        onClick={formSubmitFunc}
                        className={`rounded-md bg-indigo-600 px-3 py-2 w-full md:w-fit lg:w-full text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                          offerTitle || previewImages.length > 0
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        Add Offer Images
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
                {carouselData?.length <= 0 ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <h5 className="font-semibold">No offer images and tilte</h5>
                  </div>
                ) : (
                  <div>
                    {carouselData?.map((item) => (
                      <div
                        className="font-semibold flex flex-col border  items-start gap-3 mb-3 p-3 rounded"
                        key={item._id}
                      >
                        <div className="flex flex-wrap w-full gap-3">
                          {item?.carouselImage?.map((itemImg, index) => (
                            <div key={index}>
                              <img
                                className="w-[6rem] rounded lg:w-[9rem]"
                                src={itemImg.image}
                                alt="carousel-image"
                              />
                            </div>
                          ))}
                        </div>

                        <span className="mt-2 ">
                          Offer Title :{" "}
                          <span className="text-blue-700">
                            {item.offerTitle}
                          </span>
                        </span>

                        <div className="flex justify-end gap-5 mt-3 w-full">
                          <FaEdit
                            onClick={() => setUpdateId(item._id)}
                            size={20}
                            className="text-blue-600 hover:text-green-600 cursor-pointer "
                          />
                          <RiDeleteBin6Line
                            onClick={() => deleteCarouselFunc(item._id)}
                            size={20}
                            className="hover:text-red-600 cursor-pointer   text-gray-600"
                          />
                        </div>
                      </div>
                    ))}

                    {/* carousel update section  */}
                    {updateId && (
                      <div className="">
                        <h5 className="text-center font-semibold text-[1.2rem] text-gray-700">
                          Update Title & Images
                        </h5>
                        <hr className="border border-dashed border-black mt-2" />

                        <div className="mt-4 flex flex-wrap justify-between items-start gap-2 w-full">
                          <div className="w-full lg:w-[45%]">
                            <div className="">
                              <label
                                htmlFor="offerTitle"
                                className="block text-sm/6 font-medium text-gray-900"
                              >
                                Offer Title
                              </label>
                              <div className="mt-2">
                                <textarea
                                  value={updateOfferTitle}
                                  onChange={(e) =>
                                    setUpdateOfferTitle(e.target.value)
                                  }
                                  name="offerTitle"
                                  id="offerTitle"
                                  rows={3}
                                  placeholder="Write offer title Ex : festival offer 20 % discount on each product"
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-[45%]">
                            <label
                              htmlFor="cover-photo"
                              className="block text-sm/6 font-medium text-gray-900"
                            >
                              Offer images
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-900/25 px-6 py-10">
                              <div className="text-center">
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

                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                  <label
                                    htmlFor="carouselImage"
                                    className="relative cursor-pointer text-indigo-500 hover:bg-indigo-600 hover:border-white select-none hover:text-white border-2 border-indigo-500 p-1 rounded-md bg-white font-semibold "
                                  >
                                    <span>Upload Offer Images</span>
                                    <input
                                      id="carouselImage"
                                      name="carouselImage"
                                      type="file"
                                      multiple
                                      onChange={updateFileHandleFunc}
                                      className="sr-only"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            {updatePrevImg?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {updatePrevImg?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="w-[6.5rem] lg:w-[9.5rem]  relative h-fit rounded"
                                  >
                                    <img
                                      src={item.image}
                                      className="rounded"
                                      alt="item-image"
                                    />
                                    <MdClose
                                      onClick={() =>
                                        removeExistedImageFunc(item.image)
                                      }
                                      className="rounded-full cursor-pointer h-6 w-6 p-1 absolute top-1 hover:bg-indigo-700 right-1 bg-black text-white"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
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

export default UploadCarousel;
