import { useContext } from "react";
import AdminHome from "../components/molecules/AdminHome";
import Header from "../components/molecules/Header";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { state } = useContext(AuthContext);

  return (
    <div className="home">
      <Header />

      {state?.user.role === "admin" && <AdminHome />}
    </div>
  );
}
