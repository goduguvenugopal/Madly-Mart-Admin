import React, { useContext, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { SmallLoading } from "../components/Loading";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { dataContext } from "../../App";
import { Maincategories } from "../data";
import useCategoryOptions from "../components/useCategoryOptions";

const UploadProducts = () => {
  const { api, token } = useContext(dataContext);
  const inputFocus = useRef();
  const [tags, setTags] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [descPoints, setDescPoints] = useState("");
  const variantsInitialData = {
    color: "",
    capacity: "",
    size: "",
    weight: "",
    originalCost: 200,
    sellingCost: 150,
    stock: 10,
  };
  const [variants, setVariants] = useState(variantsInitialData);
  const initialProductData = {
    itemName: "",
    itemDescription: "",
    descriptionPoints: [],
    itemCost: "",
    itemQty: "1",
    variants: [],
    minOrderQty: "",
    itemStock: "",
    itemCategory: "",
    itemSubCategory: "",
    offerCost: "",
    offerMessage: "",
    productTags: [],
  };

  const [productData, setProductData] = useState(initialProductData);
  const [addBtnSpinner, setAddBtnSpinner] = useState(false);
  const { subCategoryOptions } = useCategoryOptions({ productData });
  const [itemSubCategory, setItemSubCategory] = useState([]);

  useEffect(() => {
    setItemSubCategory(subCategoryOptions);
  }, [subCategoryOptions]);

  // Add tags into the productTags array
  const addTagsInArray = () => {
    if (tags.trim()) {
      setProductData((prevData) => ({
        ...prevData,
        productTags: [...prevData.productTags, tags],
      }));
      setTags("");
      inputFocus.current.focus();
    }
  };

  // remove tags from array
  const removeTagsInArray = (item) => {
    const remainTags = productData.productTags.filter(
      (itemIterate) => itemIterate !== item
    );
    setProductData((prevData) => ({
      ...prevData,
      productTags: remainTags,
    }));
    inputFocus.current.focus();
  };

  // files handling
  const fileHandleFunc = (event) => {
    const filesArray = Array.from(event.target.files);
    const newArray = filesArray.map((file) => ({
      file,
      image: URL.createObjectURL(file),
    }));
    setProductImages((prev) => [...prev, ...newArray]);
  };

  // remove product images function
  const removeImageFunction = (itemImg) => {
    const remainImages = productImages.filter((item) => item.image !== itemImg);
    setProductImages(remainImages);
  };

  // product description points
  const addDescriptionPoints = () => {
    if (descPoints.trim()) {
      setProductData((prevData) => ({
        ...prevData,
        descriptionPoints: [...prevData.descriptionPoints, descPoints],
      }));

      setDescPoints("");
    }
  };

  // remove desc points function
  const removeDescPoints = (points) => {
    const remainpoints = productData?.descriptionPoints?.filter(
      (item) => item !== points
    );
    setProductData((prevData) => ({
      ...prevData,
      descriptionPoints: remainpoints,
    }));
  };

  // variants form handling
  const variantsFormHandle = (e) => {};

  //product form Handle function
  const formHandleFunc = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // product form data
  const formData = new FormData();

  // Append simple fields
  formData.append("itemName", productData.itemName);
  formData.append("itemDescription", productData.itemDescription);
  formData.append("itemCost", productData.itemCost);
  formData.append("itemQty", productData.itemQty);
  formData.append("minOrderQty", productData.minOrderQty);
  formData.append("itemStock", productData.itemStock);
  formData.append("itemCategory", productData.itemCategory);
  formData.append("itemSubCategory", productData.itemSubCategory);
  formData.append("offerCost", productData.offerCost);
  formData.append("offerMessage", productData.offerMessage);

  // Append arrays (as individual fields)
  productData.descriptionPoints.forEach((points, index) => {
    formData.append(` descriptionPoints[${index}]`, points);
  });

  productData.productTags.forEach((tag, index) => {
    formData.append(`productTags[${index}]`, tag);
  });

  // append files as individual files
  productImages.forEach((img) => formData.append("images", img.file));

  // form submit function
  const formSubmitFunc = async (event) => {
    event.preventDefault();
    if (productData.productTags.length === 0) {
      toast.error("Please add product tag names");
    } else {
      try {
        setAddBtnSpinner(true);
        const res = await axios.post(
          `${api}/api/product/save-product`,
          formData,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          toast.success("Product added successfully");
          setProductData(initialProductData);
          setProductImages([]);
          setAddBtnSpinner(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Product not added try again");
        setAddBtnSpinner(false);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />
      <div className="mt-[6.1rem] p-3 lg:p-5">
        <h5 className="text-[1.4rem] font-semibold text-center">
          Add products
        </h5>
        <hr className="border-1 border-gray-600 my-1" />

        <form
          className="lg:flex lg:justify-between lg:gap-3 pt-5 "
          onSubmit={formSubmitFunc}
        >
          <div className=" lg:w-[40vw]">
            <label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Product photos <span className="text-red-500">*</span>
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
                {/* file inpu section  */}
                <div className="mt-4 flex flex-col text-sm/6 text-gray-600">
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
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      multiple
                      onChange={fileHandleFunc}
                      className="sr-only"
                    />
                  </label>
                  <p className="pt-2 text-[1rem] text-gray-600">
                    {" "}
                    only accepts JPG, PNG, JPEG, WEBP image files
                  </p>
                </div>
              </div>
            </div>
            {/* render selected images  */}
            <div className="flex flex-wrap gap-2 mt-4">
              {productImages?.map((item, index) => (
                <div
                  key={index}
                  className="w-[6.5rem] lg:w-[9.5rem]  relative h-fit rounded"
                >
                  <img src={item.image} className="rounded" alt="item-image" />
                  <MdClose
                    onClick={() => removeImageFunction(item.image)}
                    className="rounded-full cursor-pointer h-6 w-6 p-1 absolute top-1 hover:bg-indigo-700 right-1 bg-black text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/*form input fields starts from here  */}
          <div className="space-y-12 lg:w-[50vw]">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="itemName"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1  outline-gray-500 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                      type="text"
                      name="itemName"
                      id="itemName"
                      required
                      value={productData.itemName}
                      onChange={formHandleFunc}
                      className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                      placeholder="Enter Product name"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="itemCost"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Cost <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1  outline-gray-500 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                    <input
                      type="text"
                      name="itemCost"
                      onChange={formHandleFunc}
                      value={productData.itemCost}
                      required
                      id="itemCost"
                      className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                      placeholder="Enter Product Cost"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="itemDescription"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    name="itemDescription"
                    onChange={formHandleFunc}
                    value={productData.itemDescription}
                    id="itemDescription"
                    rows={3}
                    placeholder="Write product description"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="descPoints"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Description Points
                </label>
                <div className="mt-2 flex gap-2">
                  <textarea
                    name="descPoints"
                    onChange={(e) => setDescPoints(e.target.value)}
                    value={descPoints}
                    id="descPoints"
                    rows={3}
                    placeholder="Add product description key points"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {/* add points  */}
                  <button
                    type="button"
                    onClick={addDescriptionPoints}
                    className="p-2 w-24 h-10 rounded bg-blue-700 text-white"
                  >
                    Add
                  </button>
                </div>
                {/* rendering description points  */}
                <div className="mt-4 w-full flex flex-col flex-wrap gap-2">
                  {productData?.descriptionPoints?.map((point, index) => (
                    <div
                      className="w-fit flex justify-between px-2 items-center gap-3 bg-gray-600 text-white rounded p-1 "
                      key={index}
                    >
                      {point}
                      <MdClose
                        className="cursor-pointer bg-black"
                        onClick={() => removeDescPoints(point)}
                        size={25}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="offerMessage"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  offer message
                </label>
                <div className="mt-2">
                  <textarea
                    name="offerMessage"
                    onChange={formHandleFunc}
                    value={productData.offerMessage}
                    id="offerMessage"
                    rows={3}
                    placeholder="Example :- Reduced Prices 50% discount on each product"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
            {/* variants section starts here  */}

            <div className="border-b border-gray-900/10 pb-5">
              <h4 className=" text-sm lg:text-[1.2rem] font-medium text-gray-900">
                Add Variants
              </h4>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="color"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Color
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="color"
                     //  color}
                      placeholder="Enter product color"
                      onChange={variantsFormHandle}
                      id="color"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="capacity"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Capacity
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="capacity"
                      placeholder="Enter product capacity"
                      onChange={variantsFormHandle}
                     //  capacity}
                      id="capacity"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="weight"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Weight
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="weight"
                      onChange={variantsFormHandle}
                     //  weight}
                      placeholder="Enter product weight "
                      id="weight"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="sellingCost"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Selling Cost
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="sellingCost"
                      placeholder="Enter product selling cost"
                      onChange={variantsFormHandle}
                     //  sellingCost}
                      id="sellingCost"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="originalCost"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Original Cost
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="originalCost"
                      placeholder="Enter product original Cost"
                      onChange={variantsFormHandle}
                     //  originalCost}
                      id="originalCost"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="stock"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Variant Stock <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                     //  stock}
                      onChange={variantsFormHandle}
                      placeholder="Enter stock quantity"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="itemWeight"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Product Size
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      onChange={variantsFormHandle}
                      id="itemWeight"
                     //  weight}
                      name="itemWeight"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option disabled value="">
                        Select the product Size
                      </option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="itemStock"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="itemStock"
                      id="itemStock"
                      value={productData.itemStock}
                      onChange={formHandleFunc}
                      placeholder="Enter stock quantity"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="offerCost"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Original Cost
                  </label>
                  <div className="mt-2">
                    <input
                      id="offerCost"
                      name="offerCost"
                      value={productData.offerCost}
                      placeholder="Enter product orginal cost"
                      onChange={formHandleFunc}
                      type="text"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="itemCategory"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="itemCategory"
                      name="itemCategory"
                      autoComplete="itemCategory"
                      required
                      value={productData.itemCategory}
                      onChange={formHandleFunc}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option disabled value="">
                        Select the Category
                      </option>
                      {Maincategories.map((item, index) => (
                        <option key={index} className="capitalize" value={item}>
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

                <div className="sm:col-span-3">
                  <label
                    htmlFor="itemSubCategory"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="itemSubCategory"
                      name="itemSubCategory"
                      autoComplete="itemSubCategory"
                      required
                      value={productData.itemSubCategory}
                      onChange={formHandleFunc}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option disabled value="">
                        Select the Sub Category
                      </option>

                      {itemSubCategory?.map((item, index) => (
                        <option key={index} value={item}>
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="minOrderQty"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Minimum Order Quantity
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="minOrderQty "
                      value={productData.minOrderQty}
                      name="minOrderQty"
                      onChange={formHandleFunc}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option disabled value="">
                        Select the minimum order quantity
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
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

               
                <div className="col-span-full">
                  <label
                    htmlFor="productTags"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Product Tags <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type="text"
                      ref={inputFocus}
                      name="productTags"
                      id="productTags"
                      value={tags}
                      placeholder="Enter product tag names"
                      onChange={(e) => setTags(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <button
                      onClick={addTagsInArray}
                      type="button"
                      className="absolute hover:bg-indigo-800  text-white top-0 right-0 w-[6rem] rounded-tr-md rounded-br-md bg-indigo-600 py-1.5 font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-4 w-full flex flex-row flex-wrap gap-2">
                    {productData.productTags.map((item, index) => (
                      <div
                        className=" flex justify-around items-center gap-3 bg-blue-900 text-white rounded-full px-3 h-8"
                        key={index}
                      >
                        {item}
                        <MdClose
                          className="cursor-pointer"
                          onClick={() => removeTagsInArray(item)}
                          size={19}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-x-6">
                {addBtnSpinner ? (
                  <button
                    disabled={true}
                    type="button"
                    className="flex cursor-not-allowed items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-2 w-full md:w-fit lg:w-full text-sm font-semibold text-white shadow-sm "
                  >
                    <SmallLoading /> Adding products...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 w-full md:w-fit lg:w-full text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Products
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadProducts;
