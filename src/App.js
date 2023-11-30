import { Store } from "./Store";
import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/profile/ViewProfile";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";
import UnprotectedRoute from "./components/protectedRoute/UnprotectedRoute";
import Cars from "./components/Car/Car";
import ViewCar from "./components/Car/ViewCar";
import Auction from "./components/auction/Auction";
import Bid from "./components/bid/Bids";
import ViewAuction from "./components/auction/ViewAuction";
import Transaction from "./components/transaction/Transaction";
import ViewTransaction from "./components/transaction/ViewTransaction";
import Query from "./components/query/Query";
import ViewQuery from "./components/query/ViewQuery";

function App() {
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/view-profile", element: <ViewProfile /> },
    { path: "/admin/users", element: <Users /> },
    { path: "/admin/auctions", element: <Auction /> },
    { path: "/admin/transactions", element: <Transaction /> },
    { path: "/admin/bids", element: <Bid /> },
    { path: "/admin/queries", element: <Query /> },
    { path: "/admin/view/user/:id", element: <ViewUser /> },
    { path: "/admin/vehicles", element: <Cars /> },
    { path: "/admin/view/vehicle/:id", element: <ViewCar /> },
    { path: "/admin/view/auction/:id", element: <ViewAuction /> },
    { path: "/admin/view/transaction/:id", element: <ViewTransaction /> },
    { path: "/admin/view/query/:id", element: <ViewQuery /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        {/* <Menu/> */}
        {userInfo?.role === "admin" && <SideNavbar isExpanded={isExpanded} />}
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} ${
          token ? "" : "m-0"
        } d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />
          {routeList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{element}</AdminProtectedRoute>}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
