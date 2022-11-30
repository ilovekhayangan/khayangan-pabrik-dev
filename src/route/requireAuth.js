import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const authStore = useSelector((state) => state.auth);

  let location = useLocation();

  if (!authStore.user || authStore.user.role !== "ADMINFACTORY") {
    return window.location.assign(`${process.env.REACT_APP_LOGOUT}`);
  }

  return children;
};

export default RequireAuth;
