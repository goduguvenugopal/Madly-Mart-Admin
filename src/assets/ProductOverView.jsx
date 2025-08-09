import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { dataContext } from "../App";
import { CustomLoading, SmallLoading } from "./components/Loading";

const ProductOverView = () => {
  const { api, token } = useContext(dataContext);
  const { id } = useParams();
  const [btnToggle, setBtnToggle] = useState(true);
  const [product, setProduct] = useState({});
  const [spin, setSpin] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();
  const [delSpin, setDelSpin] = useState(false);

  useEffect(() => {
    // fetching single product
    const getProduct = async () => {
      setSpin(true);
      try {
        const res = await axios.get(
          `${api}/api/product/get-single-product/${id}`
        );
        if (res) {
          setProduct(res.data.retrievedSingleProduct);
          setSpin(false);
        }
      } catch (error) {
        console.error(error);
        setSpin(false);
      }
    };

    getProduct();
  }, [id, navigate]);

  // set default image
  useEffect(() => {
    if (product?.itemImage?.length) {
      setImgUrl(product.itemImage[0]);
    }
  }, [product]);

  // delete product function
  const deleteProductFunc = async () => {
    const isOkay = confirm(
      "Product will be deleted permanently, are you sure ?"
    );
    if (isOkay) {
      setDelSpin(true);
      try {
        const res = await axios.delete(
          `${api}/api/product/delete-product/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          setDelSpin(false);
          navigate("/products");
        }
      } catch (error) {
        console.error(error);
        setDelSpin(false);
      }
    }
  };

  return (
    <div className="mt-[6.1rem] p-3 lg:p-5 pb-9">
      <h5 className="text-center text-[1.2rem] font-seri  font-semibold">
        Product Over View & Update
      </h5>
      <hr className="border  border-gray-200 mb-3 mt-1" />
      <div className="flex justify-between lg:justify-around gap-1 flex-wrap pb-3">
        <Link
          to="/products"
          className="py-1 font-semibold rounded-full border border-gray-400 px-3 text-center  hover:bg-black hover:text-white"
        >
          All Products
        </Link>
        <Link
          to="."
          onClick={() => setBtnToggle(true)}
          className={` hover:border-blue-700 cursor-pointer  font-semibold select-none ${
            btnToggle
              ? "bg-blue-500 text-white  font-semibold rounded-full  text-center border border-blue-500 px-3  py-1"
              : "py-1  text-black  font-semibold rounded-full border border-gray-400 px-3 text-center  "
          }`}
        >
          Product
        </Link>
        {product?._id ? (
          <Link
            to="updateproduct"
            onClick={() => setBtnToggle(false)}
            className={`hover:border-blue-700 cursor-pointer  font-semibold select-none ${
              !btnToggle
                ? " w-20 text-center bg-blue-500 text-white  font-semibold rounded-full   border border-blue-500  py-1"
                : "py-1   w-20 text-center  text-black  font-semibold rounded-full border border-gray-400 "
            }`}
          >
            Update
          </Link>
        ) : (
          <div
            className={`hover:border-blue-700 cursor-pointer  font-semibold select-none ${
              !btnToggle
                ? " w-20 text-center bg-blue-500 text-white  font-semibold rounded-full   border border-blue-500  py-1"
                : "py-1   w-20 text-center  text-black  font-semibold rounded-full border border-gray-400 "
            }`}
          >
            Update
          </div>
        )}
      </div>

      <hr className="border border-dashed border-gray-400 mb-5" />
      {btnToggle ? (
        <>
          {spin ? (
            <CustomLoading customHeight="h-[50vh]" />
          ) : (
            <div className="lg:flex lg:items-start lg:justify-between">
              <div className=" lg:w-2/4">
                <img
                  src={imgUrl.image}
                  alt={product.itemName}
                  className="rounded-md w-full"
                />
                <div className="flex w-full gap-2 mt-5 overflow-auto">
                  {product?.itemImage?.map((item) => (
                    <img
                      onClick={() => setImgUrl(item)}
                      key={item._id}
                      src={item.image}
                      alt="product-img"
                      className="w-[100px] rounded cursor-pointer border-2 hover:border-blue-600"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3 lg:mt-0 lg:w-[45%]">
                <h5 className="text-2xl">Product Details</h5>
                <hr className="border  border-gray-200 mb-2 mt-2" />
                <h5 className="text-blue-800 text-[1.1rem]">
                  Item Name :{" "}
                  <span className="text-black font-semibold capitalize">
                    {product.itemName}
                  </span>
                </h5>
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item Cost :{" "}
                  <span className="text-black font-semibold te">
                    ₹{product.itemCost}
                  </span>
                </h5>
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item offer message :{" "}
                  <span className="text-black font-semibold te">
                    {product?.offerMessage}
                  </span>
                </h5>

                <hr className="border  border-gray-200 mb-2 mt-1" />
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item Offer Cost :{" "}
                  <span className="text-black font-semibold">
                    ₹{product.offerCost}
                  </span>
                </h5>
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item Minimum Order Qty :{" "}
                  <span className="text-black font-semibold">
                    {product.minOrderQty}
                  </span>
                </h5>

                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item Stock :{" "}
                  <span className="text-black font-semibold">
                    {product.itemStock}
                  </span>
                </h5>
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item Category :{" "}
                  <span className="text-black font-semibold">
                    {product.itemCategory}
                  </span>
                </h5>
                <h5 className="text-blue-800 mt-2 text-[1.1rem]">
                  Item SubCategory :{" "}
                  <span className="text-black font-semibold">
                    {product.itemSubCategory}
                  </span>
                </h5>
                <details className="text-blue-800 cursor-pointer mt-2 text-[1.1rem]">
                  <summary>Item description</summary>
                  <span className="text-gray-600 font-semibold mt-1">
                    {product.itemDescription}
                  </span>
                </details>

                <details className="flex cursor-pointer flex-col flex-wrap gap-2 mt-2">
                  <summary className="text-blue-800 text-nowrap text-[1.1rem] ">
                    Description Points
                  </summary>
                  {product?.descriptionPoints?.map((item, index) => (
                    <p
                      key={item}
                      className="text-gray-600 w-fit mt-1 font-semibold"
                    >
                      {index + 1}. {item}
                    </p>
                  ))}
                </details>

                <details className="cursor-pointer">
                  <summary className="text-blue-800 text-nowrap text-[1.1rem] ">
                    Variants
                  </summary>
                  <section className="overflow-x-auto mt-2 grid grid-cols-1">
                    <table className="min-w-full text-sm text-left border border-gray-200">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="px-4 py-2">No.</th>
                          <th className="px-4 py-2">Color</th>
                          <th className="px-4 py-2">Capacity</th>
                          <th className="px-4 py-2">Size</th>
                          <th className="px-4 py-2">Weight</th>
                          <th className="px-4 py-2">Original Cost</th>
                          <th className="px-4 py-2">Selling Cost</th>
                          <th className="px-4 py-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product?.variants?.map((variant, index) => (
                          <tr key={index} className="border-t">
                            <td
                              
                              className="px-4 py-2 cursor-pointer"
                            >
                             {index + 1}
                            </td>
                            <td className="px-4 py-2">{variant.color}</td>
                            <td className="px-4 py-2">{variant.capacity}</td>
                            <td className="px-4 py-2">{variant.size}</td>
                            <td className="px-4 py-2">{variant.weight}</td>
                            <td className="px-4 py-2">
                              ₹{variant.originalCost}
                            </td>
                            <td className="px-4 py-2 text-green-600 font-semibold">
                              ₹{variant.sellingCost}
                            </td>
                            <td className="px-4 py-2">{variant.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </details>

                <div className="flex items-start flex-wrap gap-1 mt-2">
                  <h5 className="text-blue-800  text-[1.1rem] text-nowrap">
                    Product Tags :
                  </h5>
                  {product?.productTags?.map((item) => (
                    <span
                      key={item}
                      className="text-white px-2 rounded bg-orange-600  font-semibold mr-2"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <hr className="border  border-gray-200 mb-4 mt-4" />
                {delSpin ? (
                  <button className="flex items-center justify-center gap-3 w-full font-semibold bg-red-500 p-2 cursor-auto rounded text-white">
                    <SmallLoading />
                    Deleting Product...
                  </button>
                ) : (
                  <button
                    className="w-full hover:bg-red-800 font-semibold bg-red-600 p-2 rounded text-white"
                    onClick={deleteProductFunc}
                  >
                    Delete Product
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <Outlet context={{ id, product }} />
      )}
    </div>
  );
};

export default ProductOverView;
