import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewAuctionReducer as reducer } from "../../reducers/auction";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
// import EditUserModel from "./EditUser.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewAuction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  //   const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, auction }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

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
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
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
                  {loading ? <Skeleton /> : `#${auction?._id}`} - Details
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    // onClick={() => setModalShow(true)}
                  />
                </div>
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
                    <p>{loading ? <Skeleton /> : auction?.auction_start}</p>
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
                      <strong>Auction Status</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.status}</p>
                  </Col>
                  {/* <Col md={4}>
                    <p className="mb-0">
                      <strong>Manufacturing Year</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.manufacture_year}</p>
                  </Col> */}
                  {/* <Col md={4}>
                    <p className="mb-0">
                      <strong>VIN</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        car?.unique_identification_number
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Colour</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.color}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Fuel Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.fuel_type}</p>
                  </Col>
                  {car?.transmission_type && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Transmission Type</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.transmission_type}</p>
                    </Col>
                  )}
                  {car?.engine_capacity && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Engine Capacity(in cc)</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.engine_capacity}</p>
                    </Col>
                  )}
                  {car?.economy && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Economy(in kmpl)</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.economy}</p>
                    </Col>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Odometer Reading</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.odometer_reading}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Drive Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.drive_type}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Number Of Cylinder's</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.num_of_cylinders}</p>
                  </Col>
                  {car?.seller_address && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Seller Address</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.seller_address}</p>
                    </Col>
                  )}
                  {car?.car_location && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Car Location</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_location}</p>
                    </Col>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : getDateTime(car.createdAt)}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : getDateTime(car.updatedAt)}</p>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>

            {/* <Card
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Image(s)
                </Card.Title>
                <Button>Add More Images</Button>
              </Card.Header>
              <Card.Body>
                {car?.images &&
                  car?.images.length > 0 &&
                  car?.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="car"
                      className="profile_pic"
                    />
                  ))}
              </Card.Body>
            </Card> */}

            {/* <Card
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Description
                </Card.Title>
                <Button>Edit Description</Button>
              </Card.Header>
              <Card.Body>{car?.description}</Card.Body>
            </Card> */}

            {/* <Card
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Key Feature(s)
                </Card.Title>
                <Button>Edit Feature</Button>
              </Card.Header>
              <Card.Body>
                {car?.key_highlights
                  ? car?.key_highlights
                  : "No Key Features Found."}
              </Card.Body>
            </Card> */}
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewAuction;
