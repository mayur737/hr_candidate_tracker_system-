import { useState, useEffect, useRef, useContext } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { showNotification } from "../utils/toast";
import { GlobalContext } from "../contexts/AllContext";

const DropdownWithIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [, dispatch] = useContext(GlobalContext);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex gap-2 items-center">
      <div onClick={toggleDropdown} className="cursor-pointer">
        <IoPersonCircle className="w-10 h-10 text-secondary mx-10" />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white border border-primary rounded-md shadow-lg z-10"
        >
          <ul>
            <li>
              <Link
                className="flex items-center px-4 py-2 hover:bg-secondary cursor-pointer"
                onClick={() => {
                  dispatch({ type: "SIGNOUT" }),
                    showNotification("success", "Logged out successfully");
                }}
              >
                <MdLogout className="w-6 h-6 mr-2 text-primary-main" />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownWithIcon;
