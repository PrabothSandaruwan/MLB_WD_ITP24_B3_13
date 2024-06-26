import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../content/Loader";
import Header from "../content/header";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sparam = new URLSearchParams(search);
  const redirect = sparam.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e) => {
    const newValue = e.target.value;
    setEmail(newValue);
    if (!validateEmail(newValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error("Wrong email address or password")
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-center">Sign in</h1>

          {email === "" ? (
            <Alert variant="info"> Please enter the email </Alert>
          ) : emailError ? (
            <Alert variant="warning"> Invalid email address {emailError} </Alert>
          ) : null}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                className={`border border-gray-300 rounded px-3 py-2 w-full focus:outline-none ${
                  emailError ? "border-red-500" : ""
                }`}
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              disabled={isLoading || !!emailError}
            >
              Sign in
            </Button>
            {isLoading && <div className="mt-4 text-center"><Loader /></div>}
          </Form>
          <Row className="py-3">
            <Col className="text-center">
              New customer?{" "}
              <Link to={redirect ? `/register/redirect=${redirect}` : "/register"} className="text-blue-500 hover:underline">
                Register
              </Link>{" "}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
