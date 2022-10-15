import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FaBars, FaUser } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiLogOut } from "react-icons/bi"
import { ImBooks } from "react-icons/im"
import { IoFileTrayStackedSharp } from "react-icons/io5"
import { MdProductionQuantityLimits } from "react-icons/md"
import { HiPrinter } from "react-icons/hi"
import { FaStamp } from "react-icons/fa"
import { IoIosColorFill } from "react-icons/io"

import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";

const sidebar_section = [
  {
    path: "/users",
    name: "Users",
    icon: <FaUser />,
  },
  {
    path: "/requests",
    name: "Requests",
    icon: <MdMessage />,
  },
  {
    path: "/BookList",
    name: "Book List",
    icon: <ImBooks />,
  },
  {
    path: "/file-manager",
    name: "Stationary Items",
    icon: <IoFileTrayStackedSharp />,
    subRoutes: [
      {
        path: "/ItemList",
        name: "General Item",
        icon: <MdProductionQuantityLimits />,
      },
      {
        path: "/settings/2fa",
        name: "Printed Format",
        icon: <HiPrinter />,
      },
      {
        path: "/settings/billing",
        name: "Printer Catridges",
        icon: <IoIosColorFill />,
      },
      {
        path: "/settings/billing",
        name: "Seals/Stamps",
        icon: <FaStamp />,
      }
    ],
  },
  {
    path: "/saved",
    name: "Log Out",
    icon: <BiLogOut />,
  },
];

const SideBar = ({ children }) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          className={`sidebar`}
          animate={{
            width: isOpen ? "250px" : "45px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
        >
          <div className="top_section" >
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  CManager
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars" onClick={toggle}>
              <FaBars size={20} />
            </div>
          </div>

          <section className="sidebar_section">

            {sidebar_section.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    key={index}
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                >
                  <div className="icon">{route.icon}</div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}

          </section>

        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
