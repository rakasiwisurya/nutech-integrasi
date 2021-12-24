import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Form, FloatingLabel, Button, Card, Image } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import { AuthContext } from "../contexts/AuthContext";
import { API, setAuthToken } from "../config/api";

import LoadingWhite from "../assets/images/loading-white.svg";

export default function Login() {
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      const response = await API.post("/login", body, config);

      setAuthToken(response?.data.data.token);

      if (response?.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });
        NotificationManager.success(
          response.data.message,
          response.data.status
        );
        setIsLoading(false);
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error?.response.data?.message) {
        NotificationManager.error(
          error.response.data.message,
          error.response.data.status
        );
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <Card style={{ width: "18rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 fw-bold text-center text-primary">
            Login
          </Card.Title>
          <Form onSubmit={handleLogin}>
            <FloatingLabel
              className="mb-3 text-primary"
              controlId="email"
              label="Email"
            >
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
              />
            </FloatingLabel>
            <FloatingLabel
              className="mb-4 text-primary"
              controlId="password"
              label="Password"
            >
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
              />
            </FloatingLabel>

            {isLoading ? (
              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-2"
                disabled
              >
                <Image src={LoadingWhite} alt={LoadingWhite} height={20} />
              </Button>
            ) : (
              <Button variant="primary" type="submit" className="w-100 mb-2">
                Sign In
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
