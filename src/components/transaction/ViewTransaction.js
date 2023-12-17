import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewTransactionReducer as reducer } from "../../reducers/transaction.js";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewTransaction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ loading, error, transaction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/get-transaction/${id}`,
          {
            headers: { Authorization: token },
          }
        );

        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
  }, [id, token]);

  const getDateTime = (dt) => {
    const dT = dt?.split(".")[0]?.split("T");
    return `${dT[0]} || ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
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
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `Transaction - `} Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction ID</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.transactionId}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Done By</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.user?.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Amount</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : transaction?.amount}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transaction Status</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <span className="badge bg-success">
                          {transaction?.status}
                        </span>
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.createdAt &&
                        getDateTime(transaction?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.updatedAt &&
                        getDateTime(transaction?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `Order Details for Transaction ID - ${transaction?.transactionId}`
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order ID</strong>
                      <span style={{ fontSize: "12px", color: "red" }}>
                        (paypalOrderId)
                      </span>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.paypalOrderId
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>ID Of Auction</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        `#${transaction?.order?.auction.auction_id}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction - Seller Name</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.seller.name
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.order?.createdAt)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Last Update</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(transaction?.order?.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `Auctioned Vehicle Details for Transaction ID - ${transaction?.transactionId}`
                  )}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car ID</strong>
                    </p>
                    <p style={{color:"orange"}}>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        `#${transaction?.order?.auction?.car._id}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Model</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car?.model
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Manufacture Company</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car?.manufacture_company
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car VIN</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car
                          ?.unique_identification_number
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car City</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car.car_city
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car State</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car.car_state
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Shuburb</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car.car_shuburb
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Postal Code</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car.car_postal_code
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Address</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        transaction?.order?.auction?.car.car_address
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewTransaction;
