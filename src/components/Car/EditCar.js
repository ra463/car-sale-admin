/* eslint-disable eqeqeq */
import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";

export default function EditCarModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [vehicle_type, setVehicle_type] = useState("");
  const [manufacture_company, setManufacture_company] = useState("");
  const [is_registered, setIs_registered] = useState();
  const [model, setModel] = useState("");
  const [manufacture_year, setManufacture_year] = useState("");
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
  const [car_state, setCar_state] = useState("");
  const [car_postal_code, setCar_postal_code] = useState();
  const [expiry_date, setExpiry_date] = useState("");
  const [owner, setOwner] = useState("");
  const [autorized_person, setAutorized_person] = useState("");
  const [body_type, setBody_type] = useState("");
  const [axle_configuration, setAxle_configuration] = useState("");
  const [gvm, setGvm] = useState();
  const [car_shuburb, setCar_shuburb] = useState("");
  const [engine_power, setEngine_power] = useState();

  const resetForm = () => {
    setManufacture_company("");
    setIs_registered();
    setModel("");
    setManufacture_year("");
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
    setCar_state("");
    setCar_postal_code();
    setExpiry_date("");
    setOwner("");
    setAutorized_person("");
    setBody_type("");
    setAxle_configuration("");
    setGvm();
    setEngine_power();
    setCar_shuburb("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/getcar/${id}`, {
          headers: { Authorization: token },
        });

        const car = data.car;
        setVehicle_type(car.vehicle_type);
        setManufacture_company(car.manufacture_company);
        setIs_registered(car.is_registered);
        setModel(car.model);
        setManufacture_year(car.manufacture_year);
        setUnique_identification_number(car.unique_identification_number);
        setColor(car.color);
        setFuel_type(car.fuel_type);
        setTransmission_type(car.transmission_type);
        car.engine_capacity && setEngine_capacity(car.engine_capacity);
        setOdometer_reading(car.odometer_reading);
        setDrive_type(car.drive_type);
        setNum_of_cylinders(car.num_of_cylinders);
        setDescription(car.description);
        setCar_address(car.car_address);
        setCar_city(car.car_city);
        setCar_state(car.car_state);
        setCar_postal_code(car.car_postal_code);
        setExpiry_date(car.expiry_date);
        setOwner(car.owner);
        setAutorized_person(car.autorized_person);
        setBody_type(car.body_type);
        setCar_shuburb(car.car_shuburb);
        car.axle_configuration && setAxle_configuration(car.axle_configuration);
        car.gvm && setGvm(car.gvm);
        car.engine_power && setEngine_power(car.engine_power);

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
          model,
          manufacture_year,
          expiry_date,
          unique_identification_number,
          color,
          owner,
          autorized_person,
          body_type,
          axle_configuration,
          gvm,
          engine_power,
          fuel_type,
          transmission_type,
          engine_capacity,
          odometer_reading,
          drive_type,
          num_of_cylinders,
          description,
          car_address,
          car_city,
          car_state,
          car_postal_code,
          is_registered,
          car_shuburb,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (data) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Vehicle Updated Succesfully", {
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
          Edit Vehicle Detail(s)
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

            {(is_registered == "true" || is_registered == true) && (
              <Form.Group className="mb-3" controlId="model">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  value={expiry_date}
                  onChange={(e) => setExpiry_date(e.target.value)}
                  type="date"
                  {...(is_registered == "true" || is_registered == true
                    ? { required: true }
                    : { required: false })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="registration_date">
              <Form.Label>Is Owner</Form.Label>
              <Form.Select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                aria-label="Default select example"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registration_date">
              <Form.Label>Is Authorized Person</Form.Label>
              <Form.Select
                value={autorized_person}
                onChange={(e) => setAutorized_person(e.target.value)}
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

            <Form.Group className="mb-3" controlId="model">
              <Form.Label>Body Type</Form.Label>
              <Form.Control
                value={body_type}
                onChange={(e) => setBody_type(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            {vehicle_type === "Truck" && (
              <>
                <Form.Group className="mb-3" controlId="model">
                  <Form.Label>Axle Configuration</Form.Label>
                  <Form.Control
                    value={axle_configuration}
                    onChange={(e) => setAxle_configuration(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="model">
                  <Form.Label>GVM</Form.Label>
                  <Form.Control
                    value={gvm}
                    onChange={(e) => setGvm(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="model">
                  <Form.Label>Engine Power</Form.Label>
                  <Form.Control
                    value={engine_power}
                    onChange={(e) => setEngine_power(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3" controlId="manufacture-year">
              <Form.Label>Manufacturing Year</Form.Label>
              <Form.Control
                value={manufacture_year}
                onChange={(e) => setManufacture_year(e.target.value)}
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

            {vehicle_type === "Car" && (
              <Form.Group className="mb-3" controlId="engine_capacity">
                <Form.Label>Engine Capacity</Form.Label>
                <Form.Control
                  value={engine_capacity}
                  onChange={(e) => setEngine_capacity(e.target.value)}
                  type="number"
                  required
                />
              </Form.Group>
            )}

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

            <Form.Group className="mb-3" controlId="car_city">
              <Form.Label>Car Location - City</Form.Label>
              <Form.Control
                value={car_city}
                onChange={(e) => setCar_city(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_city">
              <Form.Label>Car Location - State</Form.Label>
              <Form.Control
                value={car_state}
                onChange={(e) => setCar_state(e.target.value)}
                type="text"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_street">
              <Form.Label>Car Location - Suburb</Form.Label>
              <Form.Control
                value={car_shuburb}
                onChange={(e) => setCar_shuburb(e.target.value)}
                type="text"
                required
                as="textarea"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_landmark">
              <Form.Label>Car Location - Pincode</Form.Label>
              <Form.Control
                value={car_postal_code}
                onChange={(e) => setCar_postal_code(e.target.value)}
                type="number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="car_street">
              <Form.Label>Car Location - Address</Form.Label>
              <Form.Control
                value={car_address}
                onChange={(e) => setCar_address(e.target.value)}
                type="text"
                required
                as="textarea"
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
