import { setUser } from "@redux/features/auth/authSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Auth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const token = window.location.search.replace("?token=", "");
  console.log(token);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const singeValue = queryParams.get("key");
    if (!singeValue) return;
    queryParams.delete("key");
    navigate.replace({ search: queryParams.toString() });
  }, []);

  const postTokenUser = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_AUTH}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data) {
        dispatch(
          setUser({
            login: {
              token: token,
              user: data,
            },
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      postTokenUser();
    }
  }, [token]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Redirecting </p>
      <div className="lds-roller" style={{ color: "black" }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Auth;
