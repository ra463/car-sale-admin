import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Store } from "../../Store";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header({ sidebarHandler }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container fluid className="ps-0">
            <GiHamburgerMenu
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                marginLeft: "1.75rem",
                cursor: "pointer",
              }}
              onClick={() => sidebarHandler()}
            />

            <Nav className="ms-auto">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Dropdown align="end">
                  <Dropdown.Toggle
                    id="user_profile"
                    className="right-profile-logo"
                  >
                    <FaUserCircle size={"25px"} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      Signed in as
                      <br />
                      <b>{userInfo.name}</b>
                    </Dropdown.Header>

                    <Dropdown.Divider />
                    <Dropdown.Item>
                      <Link
                        to={userInfo?.role === "admin" && "/view-profile"}
                        className="dropdown-item"
                      >
                        <FaUser className="me-2" /> Profile
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link
                        onClick={signoutHandler}
                        to="/"
                        className="nav-link"
                      >
                        <FaSignOutAlt className="icon-md me-2" /> Log Out
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
}
