import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewAuctionReducer as reducer } from "../../reducers/auction";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewAuction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ loading, error, auction, bids }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log(auction);
  console.log(bids);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(
          `/api/admin/getauction/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
  }, [id, token]);

  const getTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return dT[1];
  };
  const getDate = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return dT[0];
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
                  {loading ? <Skeleton /> : "Auction"} - Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction Created By</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction Start Date</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDate(auction?.auction_start)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction End Date</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDate(auction?.auction_end)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction Start Time</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getTime(auction?.auction_start)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction End Time</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getTime(auction?.auction_end)}
                    </p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction Status</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        <span
                          className={`badge ${
                            auction?.status === "active"
                              ? "bg-success"
                              : auction?.status === "closed"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {auction?.status}
                        </span>
                      )}
                    </p>
                  </Col>
                  {bids && bids.length > 0 && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Highest Bid</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : bids[0]?.bid_amount}</p>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>

            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Card.Title>
                  {loading ? <Skeleton /> : "Auctioned Car"} - Detail(s)
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Model</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.model}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Manufacturing Company</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        auction?.car?.manufacture_company
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Manufacturing Year</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.car?.manufacture_year}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>VIN</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        auction?.car?.unique_identification_number
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Colour</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.color}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Fuel Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.fuel_type}</p>
                  </Col>
                  {auction?.car?.transmission_type && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Transmission Type</strong>
                      </p>
                      <p>
                        {loading ? (
                          <Skeleton />
                        ) : (
                          auction?.car?.transmission_type
                        )}
                      </p>
                    </Col>
                  )}
                  {auction?.car?.engine_capacity && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Engine Capacity(in cc)</strong>
                      </p>
                      <p>
                        {loading ? <Skeleton /> : auction?.car?.engine_capacity}
                      </p>
                    </Col>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Odometer Reading</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.car?.odometer_reading}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Drive Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.drive_type}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Number Of Cylinder's</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.car?.num_of_cylinders}
                    </p>
                  </Col>
                  <Col md={12}>
                    <p className="mb-0">
                      <strong>Car Image(s)</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : auction?.car?.images &&
                        auction?.car?.images.length > 0 ? (
                        auction?.car?.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="car"
                            className="profile_pic"
                          />
                        ))
                      ) : (
                        "No Image(s)"
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
                  {loading ? <Skeleton /> : "All Bid(s) Of Auction - Detail(s)"}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {bids && bids.length > 0 ? (
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Bidder</th>
                        <th>Bid Amount</th>
                        <th>Bid Date</th>
                        <th>Bid Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bids.map((bid, i) => (
                        <tr key={bid?._id} className="odd">
                          <td className="text-center">{i + 1}</td>
                          <td>{bid?.bidder?.name}</td>
                          <td>{bid?.bid_amount}</td>
                          <td>{getDate(bid?.createdAt)}</td>
                          <td>{getTime(bid?.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <MessageBox variant="info">No Bid(s) Found</MessageBox>
                )}
              </Card.Body>
            </Card>
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewAuction;
