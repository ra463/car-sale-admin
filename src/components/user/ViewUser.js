import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
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
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, token]);

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
                      <strong>FullName</strong>
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
                      <strong>Address</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user?.address}</p>
                  </Col>
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
