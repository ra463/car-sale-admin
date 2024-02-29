import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { unlockUserReducer, userReducer } from "../../reducers/user";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Spinner,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import { getError } from "../../utils/error";

export default function Users() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, users, filteredUserCount }, dispatch] = useReducer(
    userReducer,
    {
      loading: true,
      error: "",
    }
  );

  const [{ loading: unlockLoading }, dispatch1] = useReducer(
    unlockUserReducer,
    {
      loading: false,
      error: "",
    }
  );

  const unlockAccount = async (id) => {
    if (window.confirm("Are you sure you want to unlock this User?") === true) {
      try {
        dispatch1({ type: "UNLOCK_REQUEST" });
        const res = await axiosInstance.put(
          `/api/admin/unlock-user/${id}`,
          {},
          {
            headers: { Authorization: token },
          }
        );
        dispatch1({
          type: "UNLOCK_SUCCESS",
        });
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        dispatch1({ type: "UNLOCK_FAIL" });
        toast.error(getError(error), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const deleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user?\n\nNote: All Related car's, auction's and bids will also be deleted."
      ) === true
    ) {
      try {
        setDel(true);
        await axiosInstance.delete(`/api/admin/deleteuser/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
        toast.success("User Deleted Successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        toast.error(error.response, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/getallusers/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: error.response.data.message,
        });
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredUserCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                Total Users: <b>{filteredUserCount}</b>
              </span>
              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Client ID"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery(searchInput);
                      setCurPage(1);
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Client ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Mobile No.</th>
                    <th>Role</th>
                    <th>Locked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={9} />
                  ) : users && users.length > 0 ? (
                    users.map((user, i) => (
                      <tr key={user?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td style={{ color: "orange" }}>#{user?.clientId}</td>
                        <td>
                          {user?.firstname}{" "}
                          {user?.middlename
                            ? `${user?.middlename} ${user?.lastname}`
                            : user?.lastname}
                        </td>
                        <td>{user?.email}</td>
                        <td>{user?.age}</td>
                        <td>{user?.phone}</td>
                        <td>
                          {user?.role === "user" ? (
                            <span className="badge bg-success">
                              {user?.role}
                            </span>
                          ) : (
                            <span className="badge bg-primary">
                              {user?.role}
                            </span>
                          )}
                        </td>
                        <td>
                          {user?.is_locked === true ? (
                            <Button
                              onClick={() => unlockAccount(user._id)}
                              className="badge bg-warning"
                              style={{
                                cursor: "pointer",
                                padding: "7px",
                              }}
                            >
                              {unlockLoading ? (
                                <span
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "center",
                                  }}
                                >
                                  Unlocking...
                                  <Spinner animation="border" size="sm" />
                                </span>
                              ) : (
                                "Unlock"
                              )}
                            </Button>
                          ) : (
                            <span className="badge bg-secondary">No</span>
                          )}
                        </td>
                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/user/${user._id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteUser(user._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt className="m-auto" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No User(s) Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Row No.</p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredUserCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
