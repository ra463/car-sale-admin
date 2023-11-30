import React, { useContext, useEffect, useReducer, useState } from "react";
import axiosInstance from "../../utils/axiosUtil";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import MessageBox from "./MessageBox";
import Skeleton from "react-loading-skeleton";
import { Form, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { FaArrowCircleRight, FaCarSide, FaChessKing } from "react-icons/fa";
import { motion } from "framer-motion";
import { HiUsers } from "react-icons/hi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdMoney, MdQuestionAnswer } from "react-icons/md";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload.summaryData,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data: summaryData } = await axiosInstance.get(
          `/api/admin/get-admin-stats/${time}`,
          {
            headers: { Authorization: token },
          }
        );
        const payloadData = { summaryData };
        dispatch({ type: "FETCH_SUCCESS", payload: payloadData });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, time]);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row
              className="my-3 pb-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
            >
              <Col md={6}>
                <h3>Dashboard</h3>
              </Col>
              <Col md={6}>
                <div className="float-md-end d-flex align-items-center">
                  <p className="p-bold m-0 me-3">Statistics For</p>
                  <Form.Group controlId="time">
                    <Form.Select
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      aria-label="Default select example"
                    >
                      <option key="blankChoice" hidden value>
                        Select Time
                      </option>
                      <option value="all">All Time Statistics</option>
                      <option value="daily">Daily Statistics</option>
                      <option value="weekly">Weekly Statistics</option>
                      <option value="monthly">Monthly Statistics</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>
                        {summary.users && summary.users[0]
                          ? summary.users[0].total
                          : 0}
                      </h3>
                      <p>Total Users</p>
                    </div>
                    <div className="icon">
                      <HiUsers />
                    </div>
                    <Link to="/admin/users" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        {summary.cars && summary.cars[0]
                          ? summary.cars[0].total
                          : 0}
                        <sup style={{ fontSize: 20 }}></sup>
                      </h3>
                      <p>Total Vehicle's</p>
                    </div>
                    <div className="icon">
                      <FaCarSide />
                    </div>
                    <Link to="/admin/vehicles" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>
                        {summary.auctions && summary.auctions[0]
                          ? summary.auctions[0].total
                          : 0}
                      </h3>
                      <p>Total Auction's Registered</p>
                    </div>
                    <div className="icon">
                      <FaChessKing />
                    </div>
                    <Link to="/admin/auctions" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>

              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>
                        {summary.bids && summary.bids[0]
                          ? summary.bids[0].total
                          : 0}
                      </h3>
                      <p>Total Bids</p>
                    </div>
                    <div className="icon">
                      <MdMoney />
                    </div>
                    <Link to="/admin/bids" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>

              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-secondary">
                    <div className="inner">
                      <h3>
                        {summary.transactions && summary.transactions[0]
                          ? summary.transactions[0].total
                          : 0}
                      </h3>
                      <p>Total Transactions</p>
                    </div>
                    <div className="icon">
                      <MdMoney />
                    </div>
                    <Link to="/admin/transactions" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>

              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-primary">
                    <div className="inner">
                      <h3>
                        {summary.queries && summary.queries[0]
                          ? summary.queries[0].total
                          : 0}
                      </h3>
                      <p>Total Queries Submitted</p>
                    </div>
                    <div className="icon">
                      <MdQuestionAnswer />
                    </div>
                    <Link to="/admin/queries" className="small-box-footer">
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>

              <Col lg={3} sm={6}>
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>
                        {summary.amount && summary.amount[0]
                          ? summary.amount[0].total
                          : 0}
                      </h3>
                      <p>Total Transactions Amount</p>
                    </div>
                    <div className="icon">
                      <FaMoneyCheckAlt />
                    </div>
                    <div className="small-box-footer">
                      Total Amount
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
}
