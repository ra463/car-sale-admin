import React, { useContext, useEffect, useReducer, useState } from "react";
import Chart from "react-google-charts";
import axiosInstance from "../../utils/axiosUtil";
import { Store } from "../../Store";

import { getError } from "../../utils/error";

import MessageBox from "./MessageBox";
import Skeleton from "react-loading-skeleton";
import { Form, Container, Card, Row, Col, Accordion } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { IoIosPerson, IoIosPersonAdd, IoMdPie } from "react-icons/io";
import { GiNetworkBars } from "react-icons/gi";
import { FaArrowCircleRight } from "react-icons/fa";
import { motion } from "framer-motion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload.summaryData,
        intermediaries: action.payload.intermeInfo.intermediaries,
        clients: action.payload.clients,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "CLIENTS_FETCH_REQUEST":
      return { ...state, clientsLoading: true };
    case "CLIENTS_FETCH_SUCCESS":
      return {
        ...state,
        clients: action.payload.intermediaries.intermediaryClients,
        intermediariesQuo: action.payload.intermediariesQuo.quote,
        clientsLoading: false,
      };
    case "CLIENTS_FETCH_FAIL":
      return { ...state, clientsLoading: false, error: action.payload };
    case "CLIENTS_QUOTES_FETCH_REQUEST":
      return { ...state, clientsQuotesLoading: true };
    case "CLIENTS_QUOTES_FETCH_SUCCESS":
      return {
        ...state,
        clientsQuotes: action.payload.quote,
        clientsQuotesLoading: false,
      };
    case "CLIENTS_QUOTES_FETCH_FAIL":
      return { ...state, clientsQuotesLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Dashboard() {
  const [
    {
      loading,
      summary,
      error,
      intermediaries,
      clients,
      clientsLoading,
      clientsQuotesLoading,
      clientsQuotes,
      intermediariesQuo,
    },
    dispatch,
  ] = useReducer(reducer, {
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
          `/api/admin/statistics/${time}`,
          {
            headers: { Authorization: token },
          }
        );

        const { data: intermeInfo } = await axiosInstance.get(
          `/api/admin/intermediariesInfo`,
          { headers: { Authorization: token } }
        );
        // console.log(res.data);

        const payloadData = { summaryData, intermeInfo };

        // console.log(payloadData);
        // console.log(data);
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

  const getClients = async (type, id) => {
    if (type === "intermediary") {
      try {
        dispatch({ type: "CLIENTS_FETCH_REQUEST" });

        const { data: intermediaries } = await axiosInstance.get(
          `/api/admin/get-intermediary/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        const { data: intermediariesQuo } = await axiosInstance.get(
          `/api/admin/get-clientQuotes/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        // console.log(intermediariesQuo);
        // console.log(res.data.quote);

        // console.log(data?.intermediaryClients);
        const payloadData = { intermediaries, intermediariesQuo };
        dispatch({
          type: "CLIENTS_FETCH_SUCCESS",
          payload: payloadData,
        });
      } catch (err) {
        dispatch({
          type: "CLIENTS_FETCH_FAIL",
          payload: getError(err),
        });

        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } else {
      try {
        dispatch({ type: "CLIENTS_QUOTES_FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-clientQuotes/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        dispatch({
          type: "CLIENTS_QUOTES_FETCH_SUCCESS",
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: "CLIENTS_QUOTES_FETCH_FAIL",
          payload: getError(err),
        });

        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

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
                      <p>Users</p>
                    </div>
                    <div className="icon">
                      <IoIosPersonAdd />
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
                        {summary.orders && summary.orders[0]
                          ? summary.orders[0].total
                          : 0}
                        <sup style={{ fontSize: 20 }}></sup>
                      </h3>
                      <p>Orders</p>
                    </div>
                    <div className="icon">
                      <IoIosPerson />
                    </div>
                    <Link to="/admin/orders" className="small-box-footer">
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
                        {summary.payments && summary.payments[0]
                          ? summary.payments[0].total
                          : 0}
                      </h3>
                      <p>Total Orders Price</p>
                    </div>
                    <div className="icon">
                      <GiNetworkBars />
                    </div>
                    <Link to="/admin/orders" className="small-box-footer">
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
                        {summary.quantity && summary.quantity[0]
                          ? summary.quantity[0].total
                          : 0}
                      </h3>
                      <p>Total Orders Product Quantity</p>
                    </div>
                    <div className="icon">
                      <IoMdPie />
                    </div>
                    <Link to="/admin/orders" className="small-box-footer">
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
                      <h3>{summary?.intermediaries}</h3>
                      <p>Intermediaries</p>
                    </div>
                    <div className="icon">
                      <IoIosPersonAdd />
                    </div>
                    <Link
                      to="/admin/intermediaries"
                      className="small-box-footer"
                    >
                      More info {<FaArrowCircleRight />}
                    </Link>
                  </div>
                )}
              </Col>
            </Row>

            <Row className="my-4">
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <>
                  <div>
                    <h3>Intermediaries and their clients</h3>
                  </div>

                  <Accordion flush className="accor-root">
                    {intermediaries?.map((intermediary, i) => (
                      <Accordion.Item eventKey={intermediary?._id}>
                        <Accordion.Header className="accor-root-header">
                          <p>Intermediary</p> -
                          <p style={{ fontWeight: 600 }}>
                            {intermediary?.firstname +
                              " " +
                              intermediary?.lastname}
                          </p>{" "}
                        </Accordion.Header>

                        <Accordion.Body
                          onEnter={() => {
                            getClients("intermediary", intermediary?._id);
                          }}
                        >
                          {clientsLoading ? (
                            <Skeleton count={2} />
                          ) : (
                            <Row className="intermediary-quote-number-root">
                              <Col md={6} lg={3}>
                                <p className="intermediary-quote-number-total">
                                  Number of quotes:{" "}
                                  {
                                    intermediariesQuo?.filter(
                                      (intermediariesQuo) =>
                                        intermediariesQuo?.user ===
                                        intermediary?._id
                                    )?.length
                                  }
                                </p>
                              </Col>

                              <Col md={6} lg={3}>
                                <p>
                                  Number of{" "}
                                  <span style={{ fontWeight: 500 }}>new</span>{" "}
                                  quotes:{" "}
                                  <span style={{ fontWeight: 500 }}>
                                    {
                                      intermediariesQuo
                                        ?.filter(
                                          (intermediariesQuo) =>
                                            intermediariesQuo?.user ===
                                            intermediary?._id
                                        )
                                        .filter(
                                          (intermeQuoInfo) =>
                                            intermeQuoInfo?.quoteStatus ===
                                            "new"
                                        )?.length
                                    }
                                  </span>
                                </p>
                              </Col>

                              <Col md={6} lg={3}>
                                <p>
                                  Number of{" "}
                                  <span style={{ fontWeight: 500 }}>
                                    pending
                                  </span>{" "}
                                  quotes:{" "}
                                  <span style={{ fontWeight: 500 }}>
                                    {
                                      intermediariesQuo
                                        ?.filter(
                                          (intermediariesQuo) =>
                                            intermediariesQuo?.user ===
                                            intermediary?._id
                                        )
                                        .filter(
                                          (intermeQuoInfo) =>
                                            intermeQuoInfo?.quoteStatus ===
                                            "pending"
                                        )?.length
                                    }
                                  </span>
                                </p>
                              </Col>

                              <Col md={6} lg={3}>
                                <p>
                                  Number of{" "}
                                  <span style={{ fontWeight: 500 }}>
                                    closed
                                  </span>{" "}
                                  quotes:{" "}
                                  <span style={{ fontWeight: 500 }}>
                                    {
                                      intermediariesQuo
                                        ?.filter(
                                          (intermediariesQuo) =>
                                            intermediariesQuo?.user ===
                                            intermediary?._id
                                        )
                                        .filter(
                                          (intermeQuoInfo) =>
                                            intermeQuoInfo?.quoteStatus ===
                                            "closed"
                                        )?.length
                                    }
                                  </span>
                                </p>
                              </Col>
                            </Row>
                          )}
                          <Accordion flush>
                            {clientsLoading ? (
                              <Skeleton count={5} />
                            ) : (
                              clients?.user?.map((client) => (
                                <Accordion.Item eventKey={client?._id}>
                                  <Accordion.Header
                                    onClick={() => {
                                      getClients("client", client?._id);
                                      // console.log(client?._id);
                                    }}
                                    className="accor-root-header"
                                  >
                                    <p>Client Name</p> -
                                    <p style={{ fontWeight: 600 }}>
                                      {client?.firstname +
                                        " " +
                                        client?.lastname}
                                    </p>
                                  </Accordion.Header>

                                  <Accordion.Body
                                  // onEnter={() => {
                                  //   // getClients("client", client?.user?._id);
                                  //   console.log(client?.user?._id);
                                  // }}
                                  >
                                    {clientsQuotesLoading ? (
                                      <Skeleton count={3} />
                                    ) : (
                                      <Row className="intermediary-quote-number-root">
                                        <Col md={6} lg={3}>
                                          <p className="intermediary-quote-number-total">
                                            Number of quotes:{" "}
                                            {
                                              clientsQuotes?.filter(
                                                (clientsQuotes) =>
                                                  clientsQuotes?.user ===
                                                  client?._id
                                              )?.length
                                            }
                                          </p>
                                        </Col>

                                        <Col md={6} lg={3}>
                                          <p>
                                            Number of{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              new
                                            </span>{" "}
                                            quotes:{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              {
                                                clientsQuotes
                                                  ?.filter(
                                                    (clientsQuotes) =>
                                                      clientsQuotes?.user ===
                                                      client?._id
                                                  )
                                                  .filter(
                                                    (clientsQuotesInfo) =>
                                                      clientsQuotesInfo?.quoteStatus ===
                                                      "new"
                                                  )?.length
                                              }
                                            </span>
                                          </p>
                                        </Col>

                                        <Col md={6} lg={3}>
                                          <p>
                                            Number of{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              pending
                                            </span>{" "}
                                            quotes:{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              {
                                                clientsQuotes
                                                  ?.filter(
                                                    (clientsQuotes) =>
                                                      clientsQuotes?.user ===
                                                      client?._id
                                                  )
                                                  .filter(
                                                    (clientsQuotesInfo) =>
                                                      clientsQuotesInfo?.quoteStatus ===
                                                      "pending"
                                                  )?.length
                                              }
                                            </span>
                                          </p>
                                        </Col>

                                        <Col md={6} lg={3}>
                                          <p>
                                            Number of{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              closed
                                            </span>{" "}
                                            quotes:{" "}
                                            <span style={{ fontWeight: 500 }}>
                                              {
                                                clientsQuotes
                                                  ?.filter(
                                                    (clientsQuotes) =>
                                                      clientsQuotes?.user ===
                                                      client?._id
                                                  )
                                                  .filter(
                                                    (clientsQuotesInfo) =>
                                                      clientsQuotesInfo?.quoteStatus ===
                                                      "closed"
                                                  )?.length
                                              }
                                            </span>
                                          </p>
                                        </Col>
                                      </Row>
                                    )}
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))
                            )}
                          </Accordion>
                          {clientsLoading ? (
                            <Skeleton count={5} />
                          ) : (
                            clients?.length <= 0 && (
                              <p className="accor-no-clients">
                                No clients have been added for this
                                intermediary.
                              </p>
                            )
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>

                  {intermediaries?.length <= 0 && (
                    <div>
                      <h5>No intermediaries have been added.</h5>
                    </div>
                  )}
                </>
              )}
            </Row>

            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
}
