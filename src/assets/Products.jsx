import React, { useContext, useEffect, useState } from 'react'
import { dataContext } from "../App"
import axios from 'axios'
import { CustomLoading, Loading } from './Loading'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { Maincategories } from './itemSubCategory'



const Products = () => {
  const { api } = useContext(dataContext)
  const [products, setProducts] = useState([])
  const [spin, setSpin] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])


  // fecth all products function 
  const fetchAllProducts = async () => {
    try {
      setSpin(true)

      const res = await axios.get(`${api}/api/product/get-all-products`)
      if (res) {
        setProducts(res.data.retrievdProducts.reverse())
        setFilterProducts(res.data.retrievdProducts.reverse())
        setSpin(false)

      }
    } catch (error) {
      console.error(error);
      setSpin(false)


    }
  }

  useEffect(() => {
    fetchAllProducts()
  }, [])


  // search function 
  const inputHandle = (event) => {
    const inputText = event.target.value.toLowerCase();
    const filterItems = filterProducts.filter((item) =>
      item.productTags.some((tag) => tag.toLowerCase().includes(inputText))
    );
    setProducts(filterItems);
  };

  // filtering products according to the category 
  const filterFunc = (e) => {
    const itemCatName = e.target.value
    if (itemCatName === "all") {
      setProducts(filterProducts)
    } else {
      const categoryItems = filterProducts.filter((item) => item.itemCategory.toLowerCase().includes(itemCatName.toLowerCase()))
      setProducts(categoryItems)
    }
  }


  return (
    <>
      <div className='mt-[6.1rem] p-3 lg:p-5'>
        <h5 className='text-center text-2xl font-semibold mb-3 '>All Products : {products.length}</h5>
        <hr className='border border-gray-400 mb-5' />
        <div className='mb-2 lg:w-full '>
          <div className='lg:flex lg:justify-center '>
            <div className='relative   lg:w-[50%]  '>
              <input onChange={inputHandle} type="text" placeholder='Search for products' className='w-full border-2 rounded-full h-[2.5rem] pl-4 border-indigo-500 outline-2 placeholder:text-gray-600 outline-indigo-700 ' />
              <FaSearch size={20} className='absolute top-[0.6rem] text-gray-500 right-6' />
            </div>
          </div>
          <div className='flex justify-end w-full mt-5'>
            <select
              name="options"
              onChange={filterFunc}
              id="options"
              className="border-2 outline-none border-blue-500 rounded p-1"
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
              {Maincategories.map((item, index) => (
                <option key={index} className='capitalize' value={item}>{item}</option>

              ))}
            </select>

          </div>
        </div>
        {/* mapping products  */}
        <div className='pt-2 mt-4 '>
          {spin ?
            <CustomLoading customHeight="h-[55vh]" />
            :
            <>
              {products.length > 0 ?
                <div className='lg:flex lg:flex-wrap lg:justify-center lg:gap-4 '>
                  {products.map((item) => (
                    <Link to={`/products/product_over_view/${item._id}`} key={item._id} className='lg:w-[35%] flex border hover:shadow-gray-400 relative items-start gap-3 mb-3 shadow-md rounded shadow-gray-300 p-2'>
                      <div className='flex gap-2 w-[150px] overflow-auto rounded h-[130px]'>
                        {item.itemImage.map((itemImg) => (
                          <img className='w-full rounded' key={itemImg} src={itemImg} alt={item.itemName} />
                        ))
                        }
                      </div>
                      <div>
                        <h6 className='text-gray-600'>Name :  <span className='font-semibold capitalize text-black'>{item.itemName.substring(0, 17)}</span></h6>
                        <h6 className='text-gray-600'>Cost : <span className='font-semibold capitalize text-black'>{item.itemCost}</span></h6>
                        <h6 className='text-gray-600'>Stock : <span className='font-semibold capitalize text-black'>{item.itemStock}</span></h6>
                        <h6 className='text-gray-600'>Category : <span className='font-semibold capitalize text-black'>{item.itemCategory}</span></h6>

                      </div>

                    </Link>

                  ))}
                </div> :
                <div className='flex justify-center items-center w-full h-[50vh]'>
                  <h5 className='text-[1.2rem] font-semibold'>
                    No Products
                  </h5>
                </div>
              }
            </>

          }

        </div>
      </div>
    </>
  )
}


export default Products