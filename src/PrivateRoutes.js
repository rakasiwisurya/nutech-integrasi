import { useContext } from "react";
import { Redirect, Route } from "react-router";

import { AuthContext } from "./contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { state } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.isLogin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}
