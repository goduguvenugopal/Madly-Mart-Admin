import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaBars, FaDownload } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { dataContext } from "../App";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [offcanvas, setOffcanvas] = useState(false);
  const { user, token, setToken } = useContext(dataContext);
  const location = useLocation(null);

  
  
  useEffect(() => {
    const handleDocumentClick = () => {
      setToggle(false);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);



  const handleIconClick = (e) => {
    e.stopPropagation();
    setToggle(!toggle);
  };

  // removing token function
  const removeToken = () => {
    const isOkay = confirm(
      "you will be logged out permanently, are you sure ?"
    );
    if (isOkay) {
      localStorage.removeItem("token");
      setToken("");
    }
  };

  return (
    <>
      <div
        className={`bg-white w-[100vw] h-[5.2rem] flex justify-between px-4 lg:px-8 lg:justify-between fixed top-0 left-0 items-center shadow-md  z-50`}
      >
        {/* logo section  */}
        <div className="w-[11rem] md:w-[15rem]">
          <Link to="/">
          <img
            className="mt-3 w-full rounded-full"
            src="/MadlyMart.png"
            alt="dora-logo"
            />
            </Link>
        </div>

        {/* links for large device section*/}
        <div className="hidden lg:block select-none">
          <div className=" flex items-center font-semibold text-black gap-4">
            <Link
              onClick={() => setOffcanvas(false)}
              to="/"
              className={`text-[1.2rem] hover:text-blue-600 ${location.pathname === "/" ? "text-blue-600" : ""}`}
            >
              Orders
            </Link>
            <Link
              onClick={() => setOffcanvas(false)}
              to="/payments"
              className={`text-[1.2rem] hover:text-blue-600 ${location.pathname === "/payments" ? "text-blue-600" : ""}`}

            >
              Payments
            </Link>
            <Link
              onClick={() => setOffcanvas(false)}
              to="/products"
              className={`text-[1.2rem] hover:text-blue-600 ${location.pathname === "/products" ? "text-blue-600" : ""}`}
               
            >
              Products
            </Link>

            <Link
              onClick={() => setOffcanvas(false)}
              to="/carousel"
              className={`text-[1.2rem] hover:text-blue-600 ${location.pathname === "/carousel" ? "text-blue-600" : ""}`}
              
            >
              Manage Offers
            </Link>
            <Link
              onClick={() => setOffcanvas(false)}
              to="/admin"
              className={`text-[1.2rem] hover:text-blue-600 ${location.pathname === "/admin" ? "text-blue-600" : ""}`}
              
            >
              Admin
            </Link>
          </div>
        </div>

        {/* navbar and profile icon section  */}
        <div className="flex flex-wrap items-center gap-7 relative">
          <CgProfile
            onClick={handleIconClick}
            size={25}
            title="Profile"
            className="text-black cursor-pointer rounded-full"
          />
          <FaBars
            size={25}
            title="open menu"
            className="text-black cursor-pointer"
            onClick={() => setOffcanvas(true)}
          />
          {toggle && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-[2rem] w-[7rem] bg-gray-600 rounded p-1"
            >
              <h5 className="text-white hover:bg-blue-500 cursor-pointer p-1 rounded capitalize">
                {user.fullName.substring(0, 9)}
              </h5>
              <Link
                className="text-white flex hover:bg-blue-500 cursor-pointer p-1 rounded capitalize"
                to="/visitors"
              >
                Visitors
              </Link>
              <Link
                to="/admin"
                className="text-white flex hover:bg-blue-500 lg:hidden cursor-pointer p-1 rounded capitalize"
              >
                Admin
              </Link>
              <h5
                className="text-white hover:bg-blue-500 rounded  cursor-pointer p-1"
                onClick={removeToken}
              >
                Log Out
              </h5>
            </div>
          )}
        </div>
      </div>

      {/* offcanvas for small and large devices */}

      <div
        className={`fixed z-50 top-0 left-0  h-screen w-screen lg:w-[35%] p-2 transform transition-transform duration-300 ${
          offcanvas ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-gray-700 relative flex flex-col gap-4 text-white p-5  h-full w-full rounded-lg">
          <Link
            onClick={() => setOffcanvas(false)}
            to="/"
            className="text-[1.2rem] lg:hidden"
          >
            Orders
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/payments"
            className="text-[1.2rem] lg:hidden"
          >
            Payments
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/products"
            className="text-[1.2rem] lg:hidden"
          >
            Manage Products
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/uploadproducts"
            className="text-[1.2rem]"
          >
            Add New Products
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/carousel"
            className="text-[1.2rem] lg:hidden"
          >
            Manage Offers
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/addcategory"
            className="text-[1.2rem]"
          >
            Manage Category
          </Link>
          <Link
            onClick={() => setOffcanvas(false)}
            to="/discount"
            className="text-[1.2rem]"
          >
            Manage Discounts
          </Link>

          <a
            href="Dora A-Z Fresh Seller.apk"
            download="Dora A-Z Fresh Seller.apk"
            className="text-[1.2rem] absolute left-5 bottom-5 h-10 bg-blue-600 flex justify-center items-center gap-2 rounded-full w-fit hover:bg-blue-800 px-5"
          >
            <FaDownload /> Download App
          </a>

          <MdClose
            size={25}
            className="absolute right-5 cursor-pointer"
            onClick={() => setOffcanvas(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
