import React from 'react'


export const Loading = () => {
    return (

        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-white  border-t-4 border-r-4 border-blue-500 border-solid"></div>
        </div>


    )
}


export const SmallLoading = () => {

    return (
        <div className="animate-spin rounded-full h-7 w-7 border-4 border-t-white  border-t-4 border-r-4 border-blue-500 border-solid"></div>
    )
}


 
export const CustomLoading = ({customHeight}) => {
 
    
    return (

        <div className={`flex justify-center items-center  ${customHeight}`}>
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-white  border-t-4 border-r-4 border-blue-500 border-solid"></div>
        </div>


    )
}
