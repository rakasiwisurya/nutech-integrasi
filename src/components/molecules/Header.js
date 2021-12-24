import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Navbar } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

export default function Header() {
  const history = useHistory();

  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <header className="header">
      <Navbar bg="transparent" variant="primary" fixed="top" className="shadow">
        <Container>
          <Navbar.Brand
            className="text-indigo fw-bold"
            onClick={() => {
              history.push("/");
            }}
          >
            Nutech Integrasi
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button
              variant="transparent"
              className="text-indigo fw-bold"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
