import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditCarModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [manufacture_company, setManufacture_company] = useState("");
  const [registration_date, setRegistration_date] = useState("");
  const [is_registered, setIs_registered] = useState("");
  const [model, setModel] = useState("");
  const [manufacture_year, setManufacture_year] = useState("");
  const [registration_no, setRegistration_no] = useState("");
  const [unique_identification_number, setUnique_identification_number] =
    useState("");
  const [color, setColor] = useState("");
  const [fuel_type, setFuel_type] = useState("");
  const [transmission_type, setTransmission_type] = useState("");
  const [engine_capacity, setEngine_capacity] = useState("");
  const [odometer_reading, setOdometer_reading] = useState("");
  const [drive_type, setDrive_type] = useState("");
  const [num_of_cylinders, setNum_of_cylinders] = useState("");
  const [description, setDescription] = useState("");
  const [car_address, setCar_address] = useState("");
  const [car_city, setCar_city] = useState("");
  const [car_postal_code, setCar_postal_code] = useState();

  const resetForm = () => {
    setManufacture_company("");
    setRegistration_date("");
    setIs_registered("");
    setModel("");
    setManufacture_year("");
    setRegistration_no("");
    setUnique_identification_number("");
    setColor("");
    setFuel_type("");
    setTransmission_type("");
    setEngine_capacity("");
    setOdometer_reading("");
    setDrive_type("");
    setNum_of_cylinders("");
    setDescription("");
    setCar_address("");
    setCar_city("");
    setCar_postal_code();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getcar/${id}`, {
          headers: { Authorization: token },
        });

        const car = data.car;
        setManufacture_company(car.manufacture_company);
        setRegistration_date(car.registration_date);
        setIs_registered(car.is_registered);
        setModel(car.model);
        setManufacture_year(car.manufacture_year);
        setRegistration_no(car.registration_no);
        setUnique_identification_number(car.unique_identification_number);
        setColor(car.color);
        setFuel_type(car.fuel_type);
        setTransmission_type(car.transmission_type);
        setEngine_capacity(car.engine_capacity);
        setOdometer_reading(car.odometer_reading);
        setDrive_type(car.drive_type);
        setNum_of_cylinders(car.num_of_cylinders);
        setDescription(car.description);
        setCar_address(car.car_address);
        setCar_city(car.car_city);
        setCar_postal_code(car.car_postal_code);

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
        `/api/admin/updatecar/${id}`,
        {
          manufacture_company,
          registration_date,
          model,
          manufacture_year,
          registration_no,
          unique_identification_number,
          color,
          fuel_type,
          transmission_type,
          engine_capacity,
          odometer_reading,
          drive_type,
          num_of_cylinders,
          description,
          car_address,
          car_city,
          car_postal_code,
          is_registered,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Car Updated Succesfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        resetForm();
        props.onHide();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
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
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Car Detail(s)
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Manufacturing Company</Form.Label>
              <Form.Control
                value={manufacture_company}
                onChange={(e) => setManufacture_company(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registration_date">
              <Form.Label>Registration Date</Form.Label>
              <Form.Control
                value={registration_date}
                onChange={(e) => setRegistration_date(e.target.value)}
                type="text"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registration_date">
              <Form.Label>Is Registered</Form.Label>
              <Form.Select
                value={is_registered}
                onChange={(e) => setIs_registered(e.target.value)}
                aria-label="Default select example"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="model">
              <Form.Label>Model</Form.Label>
              <Form.Control
                value={model}
                onChange={(e) => setModel(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="manufacture-year">
              <Form.Label>Manufacturing Year</Form.Label>
              <Form.Control
                value={manufacture_year}
                onChange={(e) => setManufacture_year(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registration_no">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                value={registration_no}
                onChange={(e) => setRegistration_no(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="vin">
              <Form.Label>VIN Number</Form.Label>
              <Form.Control
                value={unique_identification_number}
                onChange={(e) =>
                  setUnique_identification_number(e.target.value)
                }
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="color">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                value={color}
                onChange={(e) => setColor(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fuel_type">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control
                value={fuel_type}
                onChange={(e) => setFuel_type(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="engine_capacity">
              <Form.Label>Engine Capacity</Form.Label>
              <Form.Control
                value={engine_capacity}
                onChange={(e) => setEngine_capacity(e.target.value)}
                type="number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="transmission_type">
              <Form.Label>Transmission Type</Form.Label>
              <Form.Select
                value={transmission_type}
                onChange={(e) => {
                  setTransmission_type(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="odometer_reading">
              <Form.Label>Odometer Reading</Form.Label>
              <Form.Control
                value={odometer_reading}
                onChange={(e) => setOdometer_reading(e.target.value)}
                type="number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="drive_type">
              <Form.Label>Drive Type</Form.Label>
              <Form.Control
                value={drive_type}
                onChange={(e) => setDrive_type(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="num_of_cylinders">
              <Form.Label>Number Of Cylinder(s)</Form.Label>
              <Form.Control
                value={num_of_cylinders}
                onChange={(e) => setNum_of_cylinders(e.target.value)}
                type="number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_street">
              <Form.Label>Car Location Address</Form.Label>
              <Form.Control
                value={car_address}
                onChange={(e) => setCar_address(e.target.value)}
                type="text"
                required
                as="textarea"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_city">
              <Form.Label>Car Location City</Form.Label>
              <Form.Control
                value={car_city}
                onChange={(e) => setCar_city(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_landmark">
              <Form.Label>Car Location Pincode</Form.Label>
              <Form.Control
                value={car_postal_code}
                onChange={(e) => setCar_postal_code(e.target.value)}
                type="number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Car Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                required
                as="textarea"
                rows={3}
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
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
