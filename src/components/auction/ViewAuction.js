import React, { useEffect, useReducer, useContext } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import {
  viewAuctionReducer as reducer,
  refundReducer,
} from "../../reducers/auction";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewAuction = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams();

  const [{ loading, error, auction, bids, winner }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [{ loading: refundLoading }, dispatch1] = useReducer(refundReducer, {
    loading: false,
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
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [id, token]);

  const handleRefund = async () => {
    if (
      window.confirm(
        "Are you sure you want to refund the amount to the seller/winner? By Doing this, the same amount which seller/winner has paid to you will be Refunded to seller/winner.\n\n-->The other user which didn't Paid the amount will be locked untill You(Admin) himself unlock the User.<--\n\nNote: This action cannot be undone. And The amount will be directly debited from your's linked PayPal account.\n\nThe Amount will be refunded to the user within 1-2 hours and user will be notified via Email. After Refunding the amount to the seller/winner, you will not be able to refund the amount again.\n\nAlso the status of the Auction will be changed to 'Refunded'. You should know the consequences before you Proceed further.\n\nClick OK to proceed."
      ) === true
    ) {
      try {
        dispatch1({ type: "REFUND_REQUEST" });
        const { data } = await axiosInstance.post(
          `/api/admin/refund-payment`,
          { auctionId: id },
          {
            headers: { Authorization: token },
          }
        );
        if (data) {
          dispatch1({ type: "REFUND_SUCCESS" });
          toast.success("Refund Initiated Successfully", {
            position: toast.POSITION.TOP_CENTER,
          });

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (err) {
        dispatch1({
          type: "REFUND_FAIL",
        });
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const getTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return dT[1];
  };
  const getDate = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return dT[0];
  };

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
                  {loading ? <Skeleton /> : "Auction"} - Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auction ID</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      #{loading ? <Skeleton /> : auction?.auction_id}
                    </p>
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
                      <strong>Asking Price Visible Status</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : auction?.show_hide_price === false ? (
                        "Not Visible"
                      ) : (
                        "Visible"
                      )}
                    </p>
                  </Col>
                  {auction?.auction_confirmed === true && (
                    <>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Is Seller Paid 10% Amount?</strong>
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <p>
                            {loading ? (
                              <Skeleton />
                            ) : auction?.is_Seller_paid10_percent === true ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-warning">No</span>
                            )}
                          </p>
                          {auction?.is_Seller_paid10_percent === true &&
                            auction?.is_Winner_paid10_percent === false && (
                              <Button
                                onClick={handleRefund}
                                style={{
                                  fontSize: "13px",
                                  padding: "3px 10px",
                                  borderRadius: "7px",
                                  marginTop: "1px",
                                  minWidth: "32vh",
                                }}
                              >
                                {refundLoading ? (
                                  <span
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      alignItems: "center",
                                    }}
                                  >
                                    Processing...
                                    <Spinner animation="border" size="sm" />
                                  </span>
                                ) : (
                                  "Refund Amount To Seller"
                                )}
                              </Button>
                            )}
                        </div>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Is Winner Paid $100 Amount?</strong>
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <p>
                            {loading ? (
                              <Skeleton />
                            ) : auction?.is_Winner_paid10_percent === true ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-warning">No</span>
                            )}
                          </p>
                          {auction?.is_Seller_paid10_percent === false &&
                            auction?.is_Winner_paid10_percent === true && (
                              <Button
                                onClick={handleRefund}
                                style={{
                                  fontSize: "13px",
                                  padding: "3px 10px",
                                  borderRadius: "7px",
                                  marginTop: "1px",
                                  minWidth: "32vh",
                                }}
                              >
                                {refundLoading ? (
                                  <span
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      alignItems: "center",
                                    }}
                                  >
                                    Processing...
                                    <Spinner animation="border" size="sm" />
                                  </span>
                                ) : (
                                  "Refund Amount To Winner"
                                )}
                              </Button>
                            )}
                        </div>
                      </Col>
                    </>
                  )}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Bidding Status</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.reserve_flag}</p>
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
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Highest Bid</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : auction?.highest_bid !== 0 ? (
                        auction?.highest_bid
                      ) : (
                        "No Bid"
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(auction.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(auction.updatedAt)}
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
                  {loading ? <Skeleton /> : "Auctioneer"} - Details
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer ID</strong>
                    </p>
                    <p style={{ color: "orange" }}>
                      {loading ? <Skeleton /> : `#${auction?.seller.clientId}`}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Name</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        auction?.seller.firstname +
                        " " +
                        (auction?.seller.middlename
                          ? auction?.seller.middlename +
                            " " +
                            auction?.seller.lastname
                          : auction?.seller.lastname)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Phone No.</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.seller.phoneNumber}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Age</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.age}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer City</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.city}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Suburb</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.shuburb}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer State</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.state}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Postcode</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.seller.postal_code}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Auctioneer Address</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.seller.address}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {auction?.auction_confirmed === true && (
              <Card
                style={{
                  marginTop: "1rem",
                }}
              >
                <Card.Header
                  style={{
                    background: "gold",
                  }}
                >
                  <Card.Title>
                    {loading ? (
                      <Skeleton />
                    ) : auction?.status === "sold" ? (
                      "Auction Winner"
                    ) : (
                      "Bid Winner"
                    )}{" "}
                    - Details
                  </Card.Title>
                </Card.Header>
                <Card.Body
                  style={{
                    background: "lightyellow",
                  }}
                >
                  <Row>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User ID</strong>
                      </p>
                      <p style={{ color: "orange" }}>
                        {loading ? <Skeleton /> : `#${winner?.clientId}`}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Full Name</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.name}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Email</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.email}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Phone No.</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.phoneNumber}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Age</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.age}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - City</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.city}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Suburb</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.shuburb}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - State</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.state}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Postcode</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner?.postal_code}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>User - Address</strong>
                      </p>
                      <p>{loading ? <Skeleton /> : winner.address}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Card
              style={{
                marginTop: "1rem",
              }}
            >
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : "Auctioned Vehicle"} - Detail(s)
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
                        <strong>Engine Capacity</strong>
                      </p>
                      <p>
                        {loading ? <Skeleton /> : auction?.car?.engine_capacity}
                      </p>
                    </Col>
                  )}
                  {auction?.car?.engine_power && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Engine Power</strong>
                      </p>
                      <p>
                        {loading ? <Skeleton /> : auction?.car?.engine_power}
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
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car City</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.car_city}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car State</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.car_state}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Suburb</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.car_shuburb}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Post Code</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : auction?.car?.car_postal_code}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Car Address</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : auction?.car?.car_address}</p>
                  </Col>
                  {/* <Col md={12}>
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
                  </Col> */}
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
