import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const RequireNotAuth = ({ children }) => {
  const authStore = useSelector((state) => state.auth);

  let location = useLocation();

  if (authStore.user && authStore.user.role === "ADMINFACTORY") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireNotAuth;
