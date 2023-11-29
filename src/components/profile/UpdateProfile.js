import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";

export default function UpdateProfileModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, userInfo } = state;
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get("/api/user/myprofile", {
          headers: { Authorization: token },
        });

        const user = data.user;

        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setRole(user.role);
        setAddress(user.address);
        setAge(user.age);

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, props.show, error]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        `/api/admin/updateuser/${userInfo._id}`,
        {
          name,
          email,
          role,
          age,
          phoneNumber,
          address,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (data) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("User Updated Successfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        ctxDispatch({ type: "PROFILE_UPDATE", payload: data.user });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        resetForm();
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        dispatch({ type: "UPDATE_FAIL" });
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container
            className="small-container"
            style={{ backgroundColor: "#f4f6f9" }}
          >
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastname">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>

            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" type="submit">
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
