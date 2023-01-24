import { useState, useContext } from "react";
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

import { LoginContext } from "../ContextProvider/Context"
import { useEffect } from "react";

const SideBar = ({ children }) => {

   const { logindata, setLoginData } = useContext(LoginContext);
   const [userName, setUserName] = useState([]);


   useEffect(() =>{
    if(logindata.ValidUserOne){
      if(logindata.ValidUserOne.name){
        setUserName(logindata.ValidUserOne.name)
      }
    }
   }, [logindata.ValidUserOne])

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
      subRoutes: [
        {
          path: "/allIssuedItemsgi",
          name: "General Item Requests",
          icon: <MdProductionQuantityLimits />,
        },
        {
          path: "/allIssuedItemspf",
          name: "Printed Format Requests",
          icon: <HiPrinter />,
        },
        {
          path: "/allIssuedItemspc",
          name: "Printer Catridges Requests",
          icon: <IoIosColorFill />,
        },
        {
          path: "/allIssuedItemsss",
          name: "Seals/Stamps Requests",
          icon: <FaStamp />,
        }
      ],
    },
    {
      path: "/myStationeryItems",
      name: "Stationery Purchased",
      icon: <BsFillCartFill />,
      subRoutes: [
        {
          path: "/myIssuedItemsgi",
          name: "My General Item",
          icon: <MdProductionQuantityLimits />,
        },
        {
          path: "/myIssuedItemspf",
          name: "My Printed Format",
          icon: <HiPrinter />,
        },
        {
          path: "/myIssuedItemspc",
          name: "My Printer Catridges",
          icon: <IoIosColorFill />,
        },
        {
          path: "/myIssuedItemsss",
          name: "My Seals/Stamps",
          icon: <FaStamp />,
        }
      ],
    },
    {
      path: "/file-manager",
      name: "Stationery Items",
      icon: <IoFileTrayStackedSharp />,
      subRoutes: [
        {
          path: "/ItemListgi",
          name: "General Item",
          icon: <MdProductionQuantityLimits />,
        },
        {
          path: "/ItemListpf",
          name: "Printed Format",
          icon: <HiPrinter />,
        },
        {
          path: "/ItemListpc",
          name: "Printer Catridges",
          icon: <IoIosColorFill />,
        },
        {
          path: "/ItemListss",
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

  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <>

      <motion.div
        className={`sidebar`}
        animate={{
          width: isOpen ? "250px" : "45px",

          // transition: {
          //   duration: 0.5,
          //   type: "spring",
          //   damping: 12,
          // },
        }}
      >
        <div className="top_section">

          <AnimatePresence>
            {isOpen && (
              <motion.h6
                variants={showAnimation}
                initial="show"
                animate="show"
                exit="show"
                className="logo"
              >
                {userName 
                ?
                  <span style={{color:"black"}}>{userName}</span>
                : 
                  <></>}
              </motion.h6>
            )}
          </AnimatePresence>

          <div className="bars">
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
                      initial="show"
                      animate="show"
                      exit="show"
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
      {/* <main>{children}</main> */}
    </>
  );
};

export default SideBar;
