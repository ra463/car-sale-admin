import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";

export default function EditUserModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [states, setState] = useState("");
  const [shuburb, setShuburb] = useState("");
  const [postal_code, setPostal_code] = useState();

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setMiddlename("");
    setEmail("");
    setAge("");
    setPhone("");
    setRole("");
    setAddress("");
    setCity("");
    setState("");
    setShuburb("");
    setPostal_code();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getuser/${id}`, {
          headers: { Authorization: token },
        });

        const user = data.user;

        setFirstname(user.firstname);
        setLastname(user.lastname);
        user.middlename && setMiddlename(user.middlename);
        setEmail(user.email);
        setAge(user.age);
        setPhone(user.phone);
        setRole(user.role);
        setAddress(user.address);
        setCity(user.city);
        setState(user.state);
        setShuburb(user.shuburb);
        setPostal_code(user.postal_code);

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
  }, [id, props.show, token, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        `/api/admin/updateuser/${id}`,
        {
          firstname,
          middlename,
          lastname,
          email,
          role,
          age,
          phone,
          address,
          city,
          state: states,
          postal_code,
          shuburb,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("User Updated Successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.TOP_CENTER,
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
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Fisrtname</Form.Label>
              <Form.Control
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Middlename</Form.Label>
              <Form.Control
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                type="number"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={states}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Suburb</Form.Label>
              <Form.Control
                type="text"
                value={shuburb}
                onChange={(e) => setShuburb(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                value={postal_code}
                type="number"
                onChange={(e) => setPostal_code(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                as="textarea"
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
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
