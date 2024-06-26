import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../content/FormContainer";
import CheckoutSteps from "../content/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import Add from "../payment_component/Add";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  console.log("Is Paid:", cart.payment.paid, "---", cart.payment.paidAt);
  console.log(paymentMethod);

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/store/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Row>
            <Col>
              <Form.Check
                type="radio"
                className="my-2"
                label="PayPal or Crdit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal / Credit Card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Row>
        </Form.Group>
        <Add />
        <Button
          type="submit"
          variant="primary"
          style={{ marginTop: "20px", marginBottom: "100px" }}
        >
          {" "}
          Continue{" "}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
