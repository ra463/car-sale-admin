import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewCarReducer as reducer } from "../../reducers/car";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import EditCarModel from "./EditCar";
import { MdOutlineInfo } from "react-icons/md";

const ViewCar = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [{ loading, error, car }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getcar/${id}`, {
          headers: { Authorization: token },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        console.log(data);
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

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Details
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Vehicle Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.vehicle_type}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Manufacturing Company</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.manufacture_company}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Model</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.model}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Manufacturing Year</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.manufacture_year}</p>
                  </Col>
                  <Col md={4}>
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
                      <strong>Is Registered</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.is_registered === false ? (
                        "No"
                      ) : (
                        "Yes"
                      )}
                    </p>
                  </Col>
                  {car?.is_registered === true && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Expiry Date</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.expiry_date}</p>
                    </Col>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Colour</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : car?.color ? car?.color : "N/A"}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Is Owner</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.owner === false ? (
                        "No"
                      ) : (
                        "Yes"
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Is Authorized Person</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.autorized_person === false ? (
                        "No"
                      ) : (
                        "Yes"
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Body Type</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.body_type ? (
                        car?.body_type
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Fuel Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.fuel_type}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Transmission Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : car?.transmission_type}</p>
                  </Col>

                  {car?.vehicle_type === "Car"
                    ? car?.engine_capacity && (
                        <Col md={4}>
                          <p className="mb-0">
                            <strong>Engine Capacity(in cc)</strong>
                          </p>
                          <p>{loading ? <Skeleton /> : car?.engine_capacity}</p>
                        </Col>
                      )
                    : car?.engine_power && (
                        <Col md={4}>
                          <p className="mb-0">
                            <strong>Engine Capacity(in hp)</strong>
                          </p>
                          <p>{loading ? <Skeleton /> : car?.engine_power}</p>
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
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.drive_type ? (
                        car?.drive_type
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Number Of Cylinder's</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : car?.num_of_cylinders ? (
                        car?.num_of_cylinders
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </Col>
                  {car?.vehicle_type === "Truck" && (
                    <>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Axle Configuration</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : car?.axle_configuration}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>GVM (in kg)</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : car?.gvm}</p>
                      </Col>
                    </>
                  )}
                  {car?.car_shuburb && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Car Suburb</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_shuburb}</p>
                    </Col>
                  )}
                  {car?.car_state && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Car State</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_state}</p>
                    </Col>
                  )}
                  {car?.car_city && (
                    <Col md={4}>
                      <p className="mb-0 show_hide_main">
                        <strong>Car City</strong>{" "}
                        {car?.car_city !== car?.seller?.city && (
                          <MdOutlineInfo
                            onMouseEnter={() => setShow(true)}
                            onMouseLeave={() => setShow(false)}
                            style={{
                              cursor: "pointer",
                              color: "#07bc0c",
                            }}
                          />
                        )}
                        <span
                          className={`${
                            show ? "show_hide_info" : "show_info_hide"
                          }`}
                        >
                          The Car Loaction is not same as the Seller Loaction
                        </span>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_city}</p>
                    </Col>
                  )}
                  {car?.car_postal_code && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Car Postcode</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_postal_code}</p>
                    </Col>
                  )}
                  {car?.car_address && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Car Address</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : car?.car_address}</p>
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
                  </Col>
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Image(s)
                </Card.Title>
                {/* <Button>Add More Images</Button> */}
              </Card.Header>
              <Card.Body>
                {car?.images && car?.images.length > 0 ? (
                  car?.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="car"
                      className="profile_pic"
                    />
                  ))
                ) : (
                  <MessageBox variant="danger">No Images Found</MessageBox>
                )}
              </Card.Body>
            </Card>

            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `${car?.model}`} - Description
                </Card.Title>
              </Card.Header>
              <Card.Body
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {car?.description}
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
                  {loading ? <Skeleton /> : `${car?.model}`} - Key Feature(s)
                </Card.Title>
                <Button>Edit Feature</Button>
              </Card.Header>
              <Card.Body>
                {car?.key_highlights ? (
                  car?.key_highlights
                ) : (
                  <b>No Key Features Found</b>
                )}
              </Card.Body>
            </Card> */}

            <EditCarModel show={modalShow} onHide={() => setModalShow(false)} />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewCar;
