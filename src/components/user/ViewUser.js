import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import {
  viewUserReducer as reducer,
  unlockUserReducer,
} from "../../reducers/user";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import EditUserModel from "./EditUser";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [{ loading: unlockLoading }, dispatch1] = useReducer(
    unlockUserReducer,
    {
      loading: false,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const res = await axiosInstance.get(`/api/admin/getuser/${id}`, {
          headers: { Authorization: token },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [id, token]);

  const unlockAccount = async () => {
    if (window.confirm("Are you sure you want to unlock this User?") === true) {
      try {
        dispatch1({ type: "UNLOCK_REQUEST" });
        const res = await axiosInstance.put(
          `/api/admin/unlock-user/${id}`,
          {},
          {
            headers: { Authorization: token },
          }
        );
        dispatch1({
          type: "UNLOCK_SUCCESS",
        });
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (error) {
        dispatch1({ type: "UNLOCK_FAIL" });
        toast.error(getError(error), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
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
                  {loading ? <Skeleton /> : `${user?.name}`} - Details
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
                      <strong>Client ID</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      #{loading ? <Skeleton /> : user?.clientId}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Full Name</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.name}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Age</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.age}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.phoneNumber}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>City</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.city}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Suburb</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.shuburb}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>State</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.state}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Postcode</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.postal_code}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Address</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.address}</p>
                  </Col>
                  {user?.is_locked === true && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Account Status</strong>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            <span
                              style={{
                                color: "orangered",
                                fontWeight: "bold",
                              }}
                            >
                              Locked
                            </span>
                          )}
                        </p>
                        <Button
                          onClick={unlockAccount}
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                            fontSize: "13px",
                            padding: "3px 10px",
                            borderRadius: "7px",
                          }}
                        >
                          {unlockLoading ? (
                            <span
                              style={{
                                display: "flex",
                                gap: "5px",
                                alignItems: "center",
                              }}
                            >
                              Unlocking...
                              <Spinner animation="border" size="sm" />
                            </span>
                          ) : (
                            "Unlock Account"
                          )}
                        </Button>
                      </div>
                    </Col>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Role</strong>
                    </p>
                    <p
                      style={{
                        color: user?.role === "admin" ? "green" : "red",
                      }}
                    >
                      {loading ? <Skeleton /> : user?.role}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user?.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user?.updatedAt)}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <p className="mb-0">
                    <strong>Profile Picture</strong>
                  </p>
                  <p>
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <img
                        className="profile_pic"
                        src={`${user?.profilePicUrl}`}
                        alt="img"
                      />
                    )}
                  </p>
                </Row>
              </Card.Body>
            </Card>

            <EditUserModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewUser;
