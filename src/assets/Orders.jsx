import React, { useContext, useEffect, useRef, useState } from 'react'
import { dataContext } from "../App"
import { FaSearch } from 'react-icons/fa'
import { CustomLoading } from './Loading'
import { IoCalendarOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'


const Orders = () => {
  const { orders, orderSpin} = useContext(dataContext)
  const [todayOrders, setTodayOrders] = useState([])
  const [todayOrders1, setTodayOrders1] = useState([])
  const [selectDate, setSelectDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const dateRef = useRef(null)


  // rendering orders according to the date 
  useEffect(() => {
    const formattedDate = new Date(selectDate).toLocaleDateString("en-GB");
    const remainTodayOrders = orders.filter((item) => item.orderDate === formattedDate)
    setTodayOrders(remainTodayOrders)
    setTodayOrders1(remainTodayOrders)

  }, [orders, selectDate])



  const dateHandleFunc = (event) => {
    const eventDate = event.target.value;
    setSelectDate(eventDate);
  }

  const handleLabelClick = () => {
    dateRef.current.click();
  };


  // select orders according to the order status filter function 
  const inputSelectHandleFunc = (e) => {
    const inputText = e.target.value
    if (inputText === "all") {
      setTodayOrders(todayOrders1)
    } else if (inputText === "alldays") {
      setTodayOrders(orders)
    }
    else {
      const remainOrders = todayOrders1.filter((item) => item.orderStatus.toLowerCase().includes(inputText.toLowerCase()))
      setTodayOrders(remainOrders)
    }
  }


  // search orders with order id function 
  const searchFunction = (e) => {
    const orderId = e.target.value
    const results = orders.filter((item) => item._id.toLowerCase().includes(orderId.toLowerCase()))
    setTodayOrders(results)
  }

  return (
    <div className='mt-[6.1rem] p-3 lg:p-5'>
      <h5 className='text-center text-2xl font-semibold mb-3 '>All Orders : {todayOrders.length}</h5>
      <hr className='border border-gray-400 mb-5' />
      <div className='mb-2 lg:w-full '>
        <div className='lg:flex lg:justify-center '>
          <div className='relative lg:w-[50%]'>
            <input type="text" placeholder='Search Orders with Order Id' onChange={searchFunction} className='w-full border-2 rounded-full h-[2.5rem] pl-4 border-indigo-500 outline-2 placeholder:text-gray-600 outline-indigo-700 ' />
            <FaSearch size={20} className='absolute top-[0.6rem] text-gray-500 right-6' />
          </div>
        </div>
        <div className='flex justify-between w-full mt-5'>
          <div className='relative h-10 w-[7.6rem] cursor-pointer'>
            <label onClick={handleLabelClick} htmlFor="selectDate" className='border-2 w-full cursor-pointer h-full rounded border-blue-500 flex items-center justify-between px-1'>
              {new Date(selectDate).toLocaleDateString("en-GB")} <IoCalendarOutline size={20} />
            </label>
            <input type="date" className=' w-full absolute inset-0 opacity-0  h-full cursor-pointer' ref={dateRef} value={selectDate} onChange={dateHandleFunc} name="selectDate" id="selectDate" />
          </div>

          <select
            name="options"
            id="options"
            onChange={inputSelectHandleFunc}
            className="border-2 outline-none border-blue-500 rounded p-1 h-10"
            defaultValue=""
          >
            <option
              value=""
              disabled
              className="text-gray-400 "
            >
              Filter
            </option>
            <option value="all">All</option>
            <option value="alldays">All Days</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="outofdelivery">Out of Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>

          </select>

        </div>
      </div>
      {/* mapping products  */}
      <div className='pt-2 mt-4 '>
        {orderSpin ?
          <CustomLoading customHeight="h-[55vh]" />
          :
          <>
            {todayOrders.length > 0 ?
              <div className='lg:flex lg:flex-wrap lg:justify-center lg:gap-4 '>
                {todayOrders.map((item) => (
                  <Link to={`/order_over_view/${item._id}`} key={item._id} className='block lg:w-[35%] border bg-orange-300 hover:shadow-gray-400 relative  mb-3 shadow-md rounded shadow-gray-300 p-3'>
                    <h6 className='text-white rounded p-1 px-2 bg-blue-500 w-fit'>Order From :  <span className='font-semibold capitalize text-white'>{item.shippingAddress[0].name}</span></h6>
                    <h6 className='text-gray-600 mt-1'>Total Amount : <span className='font-semibold capitalize text-black'>₹{item.totalAmount}</span></h6>
                    <h6 className='text-gray-600 mt-1'>Order Status : <span className={`font-semibold capitalize ${item.orderStatus === "pending" ? "bg-white text-orange-700 rounded p-1 px-2" : ""}
                     ${item.orderStatus === "cancelled" ? "bg-red-600 text-white rounded p-1 px-2" : ""} 
                     ${item.orderStatus === "confirmed" ? "bg-green-600 text-white rounded p-1 px-2" : ""}
                      ${item.orderStatus === "delivered" ? "bg-green-600 text-white rounded p-1 px-2" : ""} 
                      ${item.orderStatus === "shipped" ? "bg-green-600 text-white rounded p-1 px-2" : ""}
                       ${item.orderStatus === "outofdelivery" ? "bg-green-600 text-white rounded p-1 px-2" : ""}`}>{item.orderStatus.replace("outofdelivery", "out Of delivery")}</span></h6>
                    <h6 className='text-gray-600 mt-1'>Address : <span className='font-semibold capitalize text-black'>{item.shippingAddress[0].village}</span></h6>
                    <h6 className='text-gray-600 mt-1'>Mobile : <span className='font-semibold capitalize text-black'>{item.shippingAddress[0].phone}</span></h6>
                    <h6 className='text-gray-600 mt-1'>Ordered date : <span className='font-semibold capitalize text-black'>{item.orderDate}</span></h6>
                    <h6 className='text-gray-600  mt-1'>Order Id : <span className='font-semibold capitalize underline text-black'>{item._id}</span></h6>
                  </Link>

                ))}
              </div> :
              <div className='flex justify-center items-center w-full h-[50vh]'>
                <h5 className='text-[1.2rem] font-semibold'>
                  No Orders
                </h5>
              </div>
            }
          </>

        }

      </div>
    </div>
  )
}

export default Orders