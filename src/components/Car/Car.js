import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { carReducer } from "../../reducers/car";
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

export default function Cars() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, cars, filteredCarCount }, dispatch] = useReducer(
    carReducer,
    {
      loading: true,
      error: "",
    }
  );

  const deleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this Vehicle?\n\nNote: All Related auctions will also be deleted."
      ) === true
    ) {
      try {
        setDel(true);
        await axiosInstance.delete(`/api/admin/deletecar/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
        toast.success("Vehicle Deleted Successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        toast.error(error.response.data.message, {
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
          `/api/admin/getallcars/?vehicle_type=${status}&keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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
  }, [token, del, curPage, status, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredCarCount / resultPerPage);
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
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p className="p-bold m-0 me-3 filter-title">
                    Filter by Vehicle Type
                  </p>
                  <Form.Group controlId="status">
                    <Form.Select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setCurPage(1);
                      }}
                      aria-label="Default select example"
                    >
                      <option value="all">All</option>
                      <option value="Car">Light Vehicle</option>
                      <option value="Truck">Heavy Vehicle</option>
                    </Form.Select>
                  </Form.Group>
                </div>
                <span>
                  Total Vehicles: <b>{filteredCarCount}</b>
                </span>
              </div>

              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search By Vehicle Model"
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
                    <th>Manufacturing Company</th>
                    <th>Type</th>
                    <th>Model</th>
                    <th>VIN</th>
                    <th>Image</th>
                    <th>Colour</th>
                    <th>Reg. Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={9} />
                  ) : cars && cars.length > 0 ? (
                    cars.map((car, i) => (
                      <tr key={car?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{car?.manufacture_company}</td>
                        <td>
                          {car?.vehicle_type === "Car" ? (
                            <span className="text-secondary">
                              <b>Light Vehicle</b>
                            </span>
                          ) : (
                            <span className="text-warning">
                              <b>Heavy Vehicle</b>
                            </span>
                          )}
                        </td>
                        <td>{car?.model}</td>
                        <td>{car?.unique_identification_number}</td>
                        <td>
                          {car.images && car.images.length > 0 ? (
                            <img
                              className="profile_pic_prev"
                              src={car?.images[0]}
                              alt="img"
                            />
                          ) : (
                            <b>No Image</b>
                          )}
                        </td>
                        <td>{car?.color ? car?.color : "N/A"}</td>
                        <td>{getDateTime(car?.createdAt && car?.createdAt)}</td>
                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/vehicle/${car._id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteUser(car._id);
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
                        No Vehicles(s) Found
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
              {resultPerPage < filteredCarCount && (
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
