import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import Swal from "sweetalert2";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${BaseURL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Remove Authorization header
    delete axios.defaults.headers.common["Authorization"];

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Logged out successfully",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">Job Hunt</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
