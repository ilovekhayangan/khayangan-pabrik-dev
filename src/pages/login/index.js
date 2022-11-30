import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { useMutation } from "@apollo/client";
import * as Yup from "yup";

import { POST_LOGIN } from "@utils/gql/auth/constant";
import { removeUser, setUser } from "@redux/features/auth/authSlice";

import { Container, Typography, Alert, Grow } from "@mui/material";

// components
import Buttons from "@components/atoms/Buttons";
import ErrorLoginMessage from "@components/atoms/ErrorLoginMessage";

// assets
import icon from "@assets/logo.svg";
import cssModules from "./login.module.css";

const Login = () => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);

  const [errLogin, setErrLogin] = useState(false);

  const [mutationLogin, { data, error, loading }] = useMutation(POST_LOGIN);

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Grow in={alert}>
        <Alert
          severity="error"
          variant="filled"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "15rem",
            position: "absolute",
            right: 5,
            bottom: 5,
            color: "white",
            fontSize: "1rem",
            fontWeight: 900,
          }}
        >
          UNAUTHORIZED LOGIN
        </Alert>
      </Grow>

      <Container
        sx={{
          borderRadius: "5px",
          width: "40rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1rem 0.5rem",
        }}
      >
        <img src={icon} alt={icon} className={cssModules.icon} />
        <Typography
          sx={{
            fontSize: "2rem",
          }}
        >
          Khayangan Login
        </Typography>

        {errLogin ? <ErrorLoginMessage /> : <></>}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values) => {
            const { data } = await mutationLogin({
              variables: {
                input: {
                  email: values.email,
                  password: values.password,
                },
              },
            });

            if (!data.login) {
              setErrLogin(true);
              setTimeout(() => {
                setErrLogin(false);
              }, 2000);
            }

            if (data.login.user.role !== "ADMINFACTORY") {
              setAlert(true);
              setTimeout(() => {
                setAlert(false);
              }, 4000);
            } else {
              dispatch(
                setUser({
                  login: data.login,
                })
              );
            }

            return true;
          }}
        >
          {({ errors, touched }) => (
            <Form
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label htmlFor="email" className={cssModules.label}>
                  Email:
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={cssModules.input}
                  style={{
                    outline: errors.email ? "1px solid red" : "1px solid gray ",
                  }}
                  placeholder="Email"
                />
                {errors.email && touched.email ? (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {errors.email}
                  </Typography>
                ) : null}
              </div>

              <div>
                <label htmlFor="password" className={cssModules.label}>
                  Password:
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className={cssModules.input}
                  style={{
                    outline: errors.password ? "1px solid red" : "1px solid gray ",
                  }}
                  placeholder="Password"
                />
                {errors.password && touched.password ? (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {errors.password}
                  </Typography>
                ) : null}
              </div>

              <Buttons title="Login" variant="contained" bg="#EAB737" color="white" width="100%" height="2.75rem" fSize={18} radius="3px" />
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default Login;
