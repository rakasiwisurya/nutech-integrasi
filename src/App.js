import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

import Login from "./pages/Login";
import Home from "./pages/Home";

import PrivateRoute from "./PrivateRoutes";
import { AuthContext } from "./contexts/AuthContext";
import { API, setAuthToken } from "./config/api";

import "react-notifications/lib/notifications.css";
import "./assets/scss/style.scss";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const { state, dispatch } = useContext(AuthContext);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status !== 200) {
        dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;
      payload.token = localStorage.token;
      dispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="App">
      {state.isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center w-100"
          style={{ height: "100vh" }}
        >
          Loading
        </div>
      ) : (
        <>
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <PrivateRoute exact path="/" component={Home} />
            </Switch>
          </Router>
          <NotificationContainer />
        </>
      )}
    </div>
  );
}

export default App;
