import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FaBars } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { BiLogOut } from "react-icons/bi"
import { ImBooks } from "react-icons/im"
import { IoFileTrayStackedSharp } from "react-icons/io5"
import { MdProductionQuantityLimits } from "react-icons/md"
import { HiPrinter } from "react-icons/hi"
import { FaStamp } from "react-icons/fa"
import { IoIosColorFill } from "react-icons/io"
import { FaEnvelopeOpenText} from "react-icons/fa"
import {BsFillCartFill} from "react-icons/bs"
import {IoBookSharp} from "react-icons/io5"
import { TiGroup} from "react-icons/ti"
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";

const SideBar = ({ children }) => {

  const navBar_Tabs = [
    {
      path: "/UserList",
      name: "All Users",
      icon: <TiGroup />
    },
    {
      path: "/IssueRequests",
      name: "All Book Issue Requests",
      icon: <MdMessage />,
    },
    {
      path: "/myIssuedBooks",
      name: "Books Purchased",
      icon: <IoBookSharp />,
    },
    {
      path: "/BookList",
      name: "Book List",
      icon: <ImBooks />,
    },
    {
      path: "/ItemIssueRequests",
      name: "All Stationery Requests",
      icon: <FaEnvelopeOpenText />,
    },
    {
      path: "/myStationeryItems",
      name: "Stationery Purchased",
      icon: <BsFillCartFill />,
    },
    {
      path: "/file-manager",
      name: "Stationery Items",
      icon: <IoFileTrayStackedSharp />,
      subRoutes: [
        {
          path: "/ItemListGi",
          name: "General Item",
          icon: <MdProductionQuantityLimits />,
        },
        {
          path: "/ItemListPf",
          name: "Printed Format",
          icon: <HiPrinter />,
        },
        {
          path: "/ItemListPc",
          name: "Printer Catridges",
          icon: <IoIosColorFill />,
        },
        {
          path: "/ItemListSs",
          name: "Seals/Stamps",
          icon: <FaStamp />,
        }
      ],
    },
    {
      path: "/logout",
      name: "Log Out",
      icon: <BiLogOut />,
    },
  ];

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
      <motion.div
        className={`sidebar`}
        animate={{
          width: isOpen ? "250px" : "45px",

          transition: {
            duration: 0.5,
            type: "spring",
            damping: 12,
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

          {navBar_Tabs.map((route, index) => {
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
    </>
  );
};

export default SideBar;
