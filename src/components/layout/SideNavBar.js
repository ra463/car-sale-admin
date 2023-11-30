import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
import "./SideNavBar.css";
import { RiDashboard2Fill, RiHammerFill } from "react-icons/ri";
import { BiDollar } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { HiUsers } from "react-icons/hi";
import { FaCarSide, FaSignOutAlt, FaRegStar } from "react-icons/fa";

const linkList = [
  {
    icon: <RiDashboard2Fill className="icon-md" />,
    text: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    icon: <HiUsers className="icon-md" />,
    text: "Users",
    url: "/admin/users",
  },
  {
    icon: <FaCarSide className="icon-md" />,
    text: "Vehicles",
    url: "/admin/vehicles",
  },
  {
    icon: <RiHammerFill className="icon-md" />,
    text: "Auctions",
    url: "/admin/auctions",
  },
  {
    icon: <BiDollar className="icon-md" />,
    text: "Bids",
    url: "/admin/bids",
  },
  {
    icon: <GrTransaction className="icon-md" />,
    text: "Transactions",
    url: "/admin/transactions",
  },
  {
    icon: <FaRegStar className="icon-md" />,
    text: "Queries",
    url: "/admin/queries",
  },
];

const active_text = {
  Dashboard: "dashboard",
  Category: "category",
  Users: "user",
  Vehicles: "vehicle",
  Auctions: "auction",
  Transactions: "transaction",
  Bids: "bid",
  Queries: "queries",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState("User");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    return pathname.includes(active_text[text]);
  };

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="brand-link">
            {/* <img src={edwin_logo} alt="" width={"50px"} height="auto" /> */}
            <Link
              to="/admin/dashboard"
              className="brand-text ms-2 font-weight-light"
            >
              Car Auction
            </Link>
          </div>

          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <Link to="/view-profile" className="d-block">
                  {userInfo.profilePicUrl && (
                    <img
                      src={userInfo.profilePicUrl}
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                      }}
                    />
                  )}
                  <span className="info-text">
                    Welcome {userInfo ? `${userInfo.name}` : "Back"}
                  </span>
                </Link>
              </div>
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {linkList.map(({ icon, text, url }) => (
                  <li
                    key={url}
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    } ${activeLinkHandler(text) && "active-item"}`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                <li
                  className={`nav-item has-treeview ${
                    isExpanded ? "menu-item" : "menu-item menu-item-NX"
                  }`}
                >
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
