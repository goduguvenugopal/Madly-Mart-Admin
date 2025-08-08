import React, { useContext, useEffect, useState } from "react";
import { dataContext } from "../../App";
import axios from "axios";
import { FaEdit, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Loading, SmallLoading } from "./Loading";
import { RiDeleteBin6Line } from "react-icons/ri";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState([]);
  const { api, token } = useContext(dataContext);
  const [editId, setEditId] = useState("");
  const [role, setRole] = useState("");
  const [req, setReq] = useState(false);
  const [spin, setSpin] = useState(false);
  const [checkBox, setCheckBox] = useState(false);

  useEffect(() => {
    // fetching users
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${api}/api/user/get-all-users`, {
          headers: {
            token: token,
          },
        });

        if (res) {
          setFilter(res.data.reverse());
          setUsers(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [req]);

  if (users.length === 0) {
    return <Loading />;
  }

  // serach function
  const inputHandle = (event) => {
    const inputText = event.target.value.toLowerCase();
    if (checkBox) {
      const result = users.filter((item) =>
        item._id.toLowerCase().includes(inputText)
      );
      setFilter(result);
    } else {
      const result = users.filter((item) =>
        item.email.toLowerCase().includes(inputText)
      );
      setFilter(result);
    }
  };

  // fetch admins
  const checkBoxFunc = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setCheckBox(true);
    }
  };

  // update user role
  const updateUserFunc = async (userData) => {
    if (role === "") {
      toast.error("Please select the options");
    } else {
      setReq(false);
      setSpin(true);
      try {
        const res = await axios.put(
          `${api}/api/user/update-user/${editId}`,
          userData,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          setReq(true);
          setEditId("");
          setSpin(false);
          setRole("");
          toast.success("user role updated Successfully");
        }
      } catch (error) {
        console.error(error);
        toast.error("user role not updated try again");
        setReq(false);
        setSpin(false);
      }
    }
  };

  // delete user account
  const deleteAccount = async (userID) => {
    const message = confirm("User will be deleted permanently, are you sure ?");
    if (message) {
      try {
        const res = await axios.delete(`${api}/user/delete-user/${userID}`, {
          headers: {
            token: token,
          },
        });
        if (res) {
          const remainUsers = filter.filter((item) => item._id !== userID);
          setFilter(remainUsers);
          toast.success("User account deleted successfully");
        }
      } catch (error) {
        console.error(error);
        toast.error("Account not deleted Please try again");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="dark" />

      <div className="mt-[6.1rem] p-3 lg:p-5">
        <h5 className="text-center text-2xl font-semibold mb-3 ">
          All Users : {users.length}
        </h5>
        <hr className="border border-gray-400 mb-5" />

        <div className="mb-5 relative lg:w-[450px]">
          <h5 className="mb-3  font-serif">Search users with email and id</h5>
          <input
            onChange={inputHandle}
            type="text"
            placeholder="Enter User Email or Id"
            className="w-full border-2 rounded-full h-[2.3rem] pl-3 border-indigo-500 outline-2 placeholder:text-gray-600 outline-indigo-700 "
          />
          <FaSearch
            size={20}
            className="absolute top-[2.76rem] text-gray-500 right-6"
          />
          <div className="text-center mt-4">
            <input
              onChange={checkBoxFunc}
              className=""
              type="checkbox"
              name="userid"
              id="userid"
            />

            <span> click checkbox to search with user Id</span>
          </div>
        </div>

        <table className="w-full border-collapse border border-white">
          <thead>
            <tr className="bg-gray-700  text-white h-10">
              <th className="border border-white text-start pl-3">
                Name, Email, Role
              </th>
            </tr>
          </thead>
          <tbody>
            {filter.map((item) => (
              <tr key={item._id} className="bg-gray-700 h-10 text-white">
                <td className="border border-white pl-3">
                  <div className="relative flex flex-col gap-1 py-2">
                    <span className="capitalize">{item.fullName}</span>
                    <span>{item.email}</span>
                    <span>user Id : {item._id}</span>
                    <span
                      className={`${
                        item.role === "admin"
                          ? "bg-blue-500 rounded w-fit px-3 mt-1"
                          : null
                      }`}
                    >
                      {item.role}
                    </span>
                    <FaEdit
                      title="Edit"
                      onClick={() => setEditId(item._id)}
                      size={20}
                      className="absolute cursor-pointer right-2 hover:text-green-700"
                    />
                    <RiDeleteBin6Line
                      onClick={() => deleteAccount(item._id)}
                      title="Delete"
                      size={20}
                      className="absolute cursor-pointer right-[2.7rem] hover:text-red-700"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* edit modal section  */}
      {editId && (
        <div className="fixed top-0 left-0 bg-gray-700 bg-opacity-75 flex h-screen w-screen items-center justify-center p-10">
          <div className="bg-white p-3 rounded w-[300px] ">
            <h5 className="text-[1.1rem] font-semibold">
              Select the user role
            </h5>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              className="border-2 border-blue-600 mt-3 rounded w-full h-10"
            >
              <option disabled value="">
                Select the options
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {spin ? (
              <button className="bg-black mt-5 w-full text-white rounded p-2 flex items-center gap-2 justify-center">
                <SmallLoading /> Updating...
              </button>
            ) : (
              <button
                onClick={() => updateUserFunc({ role: role })}
                className="bg-black mt-5 w-full text-white rounded hover:bg-blue-500 p-2"
              >
                Update
              </button>
            )}

            <button
              onClick={() => setEditId("")}
              className="bg-red-600 mt-3 w-full text-white rounded hover:bg-red-700 p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
