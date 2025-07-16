import { FaUpload, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SidebarComponent = ({ isSidebarOpen, toggleSidebar, isMobile }) => {
  const { pathname } = useLocation();

  const Menus = [
    {
      title: "Dashboard",
      path: ["/dashboard"],
      icon: <MdOutlineDashboard size={25} />,
    },
    {
      title: "Candidates",
      path: ["/candidates", "/add-candidate", "/edit-candidate"],
      icon: <FaUsers size={25} />,
    },
    {
      title: "Bulk Upload",
      path: ["/bulk-upload"],
      icon: <FaUpload size={25} />,
    },
  ];

  const isActive = (menuPaths) =>
    menuPaths.some((path) => pathname.startsWith(path));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50
        transition-transform duration-300 ease-in-out
        ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${isSidebarOpen ? "w-64" : "w-20"}
        ${isMobile ? "top-0" : "top-14"}`}
    >
      {isMobile && (
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <IoClose size={24} className="text-primary" />
          </button>
        </div>
      )}

      <nav className="mt-4">
        {Menus.map((Menu, index) => (
          <Link
            key={index}
            to={Menu.path[0]}
            className={`group flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 mt-2
              ${
                isActive(Menu.path)
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  : "text-secondary hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100"
              }
              ${!isSidebarOpen && "justify-center"}`}
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <span className={`min-w-[24px] ${!isSidebarOpen && "mx-auto"}`}>
              {Menu.icon}
            </span>
            {isSidebarOpen && (
              <span className="ml-3 font-medium whitespace-nowrap">
                {Menu.title}
              </span>
            )}

            {!isSidebarOpen && (
              <div className="absolute left-full ml-6 hidden group-hover:block z-50">
                <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded-md whitespace-nowrap">
                  {Menu.title}
                </div>
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarComponent;
