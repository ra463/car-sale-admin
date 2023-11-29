import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { bidReducer } from "../../reducers/bid";
import { Link } from "react-router-dom";
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
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

export default function Bid() {
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, bids, filteredBidCount }, dispatch] = useReducer(
    bidReducer,
    {
      loading: true,
      error: "",
    }
  );

  const deleteBid = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this bid?\n\nNote: It will also be deleted from the auction."
      ) === true
    ) {
      try {
        setDel(true);
        await axiosInstance.delete(`/api/admin/deletebid/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
        toast.success("Bid deleted successfully", {
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
          `/api/admin/getallbids/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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

  const numOfPages = Math.ceil(filteredBidCount / resultPerPage);
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
          <Card>
            <Card.Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                Total Bids: <b>{filteredBidCount}</b>
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
                    <th>Bidded By</th>
                    <th>Auction Id</th>
                    <th>Bid Amount</th>
                    <th>Bidded At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={6} />
                  ) : bids && bids.length > 0 ? (
                    bids.map((bid, i) => (
                      <tr key={bid?._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>
                          <Link to={`/admin/view/user/${bid?.bidder._id}`}>
                            {bid?.bidder.name}
                          </Link>
                        </td>
                        <td>
                          <Link
                            style={{ color: "orange" }}
                            to={`/admin/view/auction/${bid?.auction}`}
                          >
                            #{bid?.auction}
                          </Link>
                        </td>
                        <td>{bid?.bid_amount}</td>
                        <td>{getDateTime(bid?.createdAt)}</td>
                        <td>
                          <Button
                            onClick={() => {
                              deleteBid(bid._id);
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
                      <td>
                        <b>No bids Found</b>
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
              {resultPerPage < filteredBidCount && (
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
