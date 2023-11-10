import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { userReducer } from "../../reducers/user";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

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
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } catch (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
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
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredUserCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

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
            <Card.Header style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              {/* <div className="float-start d-flex align-items-center">
                <p className="p-bold m-0 me-3">Filter by Role</p>
                <Form.Group controlId="status">
                  <Form.Select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value="all">All</option>
                    <option value="user">Seller</option>
                    <option value="intermediary">Buyer</option>
                  </Form.Select>
                </Form.Group>
              </div> */}
               <span>
                Total Users: <b>{filteredUserCount}</b>
              </span>
              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search"
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
                    <th>FullName</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Reg. Date</th>
                    <th>Mobile No.</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={8} />
                  ) : users && users.length > 0 ? (
                    users.map((user, i) => (
                      <tr key={user?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{user?.name}</td>
                        <td>{user?.email}</td>
                        <td>{user?.age}</td>
                        <td>
                          {getDateTime(user?.createdAt && user?.createdAt)}
                        </td>
                        <td>{user?.phoneNumber}</td>
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
                      <td colSpan="8" className="text-center">
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
