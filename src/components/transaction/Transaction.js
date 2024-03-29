import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
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
import { FaEye, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import { getTransactionReducer } from "../../reducers/transaction.js";

export default function Transaction() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [
    { loading, error, transactions, filteredTransactionsCount },
    dispatch,
  ] = useReducer(getTransactionReducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/get-all-transaction/?status=${status}&keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, curPage, status, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredTransactionsCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} || ${dT[1]}`;
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
          <>
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
                      Filter by Status
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
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REFUNDED">Refunded</option>
                        <option value="CANCELLED">Cancelled</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <span>
                    Total Transactions: <b>{filteredTransactionsCount}</b>
                  </span>
                </div>
                <div className="search-box float-end">
                  <InputGroup>
                    <Form.Control
                      aria-label="Search Input"
                      placeholder="Search By Transaction Id"
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
                      <th>Transaction Id</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <CustomSkeleton
                        resultPerPage={resultPerPage}
                        column={7}
                      />
                    ) : transactions && transactions.length > 0 ? (
                      transactions.map((transaction, i) => (
                        <tr key={transaction?._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          <td>{transaction?.transactionId}</td>
                          <td>${transaction?.amount}</td>
                          <td>
                            {transaction?.status === "COMPLETED" ? (
                              <span className="badge bg-success">
                                {transaction?.status}
                              </span>
                            ) : (
                              <span className="badge bg-warning">
                                {transaction?.status}
                              </span>
                            )}
                          </td>
                          <td>
                            {transaction?.user?.firstname}{" "}
                            {transaction?.user?.middlename
                              ? `${transaction?.user?.middlename} ${transaction?.user?.lastname}`
                              : transaction?.user?.lastname}
                          </td>
                          <td>
                            {getDateTime(
                              transaction?.createdAt && transaction?.createdAt
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                navigate(
                                  `/admin/view/transaction/${transaction._id}`
                                );
                              }}
                              type="success"
                              className="btn btn-primary"
                            >
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No Transaction(s) Found
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
                {resultPerPage < filteredTransactionsCount && (
                  <CustomPagination
                    pages={numOfPages}
                    pageHandler={curPageHandler}
                    curPage={curPage}
                  />
                )}
              </Card.Footer>
            </Card>
          </>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
