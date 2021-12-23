import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Form, FloatingLabel, Button, Card } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import { AuthContext } from "../contexts/AuthContext";
import { API, setAuthToken } from "../config/api";

export default function Login() {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

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
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error?.response.data?.message) {
        return NotificationManager.error(
          error.response.data.message,
          error.response.data.status
        );
      }
    }
  };

  return (
    <div className="login">
      <Card style={{ width: "18rem" }} className="shadow">
        <Card.Body>
          <Card.Title className="mb-4 fs-4 text-center">Login</Card.Title>
          <Form onSubmit={handleLogin}>
            <FloatingLabel className="mb-3" controlId="email" label="Email">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
              />
            </FloatingLabel>
            <FloatingLabel
              className="mb-4"
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
            <Button variant="primary" type="submit" className="w-100 mb-2">
              Sign In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
