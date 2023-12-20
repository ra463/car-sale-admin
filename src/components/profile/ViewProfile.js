import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import UpdateProfileModel from "./UpdateProfile";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";

const ViewProfile = () => {
  const { state } = useContext(Store);
  const { token } = state;

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/user/myprofile`, {
          headers: { Authorization: token },
        });
        console.log(data);

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
  }, [token]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} || ${dT[1]}`;
  };

  return (
    <Container fluid className="py-3">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Card>
            <Card.Header>
              <Card.Title>{user.name} - Admin</Card.Title>
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
                    <strong>Full Name</strong>
                  </p>
                  <p>{user.name}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Email</strong>
                  </p>
                  <p>{user.email}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Mobile No.</strong>
                  </p>
                  <p>{user.phoneNumber}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Role</strong>
                  </p>
                  <p>
                    <span className="badge bg-success">{user?.role}</span>
                  </p>
                </Col>
                <Col md={4}>
                    <p className="mb-0">
                      <strong>City</strong>
                    </p>
                    <p>{user.city}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Suburb</strong>
                    </p>
                    <p>{user.shuburb}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>State</strong>
                    </p>
                    <p>{user.state}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Postcode</strong>
                    </p>
                    <p>{user.postal_code}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Address</strong>
                    </p>
                    <p>{user.address}</p>
                  </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>{getDateTime(user.createdAt)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>{getDateTime(user.updatedAt)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <UpdateProfileModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </Container>
  );
};

export default ViewProfile;
