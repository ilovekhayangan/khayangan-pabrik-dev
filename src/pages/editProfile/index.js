import { Alert, Box, Button, Paper, Snackbar, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { gql, useMutation, useQuery } from "@apollo/client";
import { UPDATE_HYPERVISOR } from "@utils/gql/hypervisor/constant";
import { GET_REGIONS } from "@utils/gql/region/constant";
import oval from "@assets/oval.svg";
import profile from "@assets/Profile.svg";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateHypervisor.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userHook from "@hooks/useUserHook";
import SingleBreadcrumbs from "@components/atoms/SingleBreadrumb";

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className={cssModules.label} htmlFor={props.id || props.name}>
        {label}
      </label>
      <textarea className={cssModules.textArea} {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default function EditProfile({ close, title, data }) {
  const UserSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("This field is required")
      .test(
        "len",
        "Firsname min 3 characters",
        (val) => val != undefined && (val.length == 0 || val.length >= 3)
      ),
    lastName: Yup.string()
      .required("This field is required")
      .test(
        "len",
        "Lastname min 3 characters",
        (val) => val != undefined && (val.length == 0 || val.length >= 3)
      ),
    newPassword: Yup.string().test("len", "Password min 6 characters", (val) =>
      val == undefined || val.length < 1
        ? true
        : val != undefined && val.length != 0 && val.length >= 6
    ),
    confirmNewPassword: Yup.string().when("newPassword", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Both password need to be the same"
      ),
    }),
  });

  const auth = useSelector((state) => state.auth);

  const [id, setId] = useState("");
  const [initialName, setInitialName] = useState(null);

  const { handleUpdateUser, updateServiceLoading, successToast, errorMessage } =
    userHook();

  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

  const [mutationAddData, addData] = useMutation(UPDATE_HYPERVISOR);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: getRegionsData } = useQuery(GET_REGIONS);

  useEffect(() => {
    setId(auth.user?.id);

    let name = auth.user?.firstName + " " + auth.user?.lastName;
    let initials = [...name.matchAll(rgx)] || [];
    initials = (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase();

    setInitialName(initials);
  }, [auth]);

  return (
    <>
      <Snackbar
        open={successToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#50C878",
            color: "white",
            fontWeight: 900,
          }}
        >
          Update Profile Success!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorMessage !== ""}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            bgcolor: "red",
            color: "white",
            fontWeight: 900,
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      ></Box>

      {/* Card */}
      <Box
        sx={{
          width: "100%",
          px: "2rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ paddingTop: "0.25rem", paddingBottom: "1.5rem" }}>
          <SingleBreadcrumbs title="Edit User" route="dashboard" />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #D8D8D8",
            boxSizing: "border-box",
            p: "1rem 0rem",
          }}
        >
          <Typography fontSize="1.5rem" style={{ fontWeight: 500 }}>
            Edit User
          </Typography>
        </Box>

        {/* Form Card */}
        <Paper
          elevation={3}
          sx={{
            boxSizing: "border-box",
            p: "1rem 1.5rem 1.5rem 1.5rem",
            backgroundColor: "rgba(238, 182, 40, 0.15)",
            backgroundImage: `url(${oval})`,
            backgroundPosition: "100px 50%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100rem",
          }}
        >
          <Formik
            initialValues={{
              firstName: auth.user.firstName,
              lastName: auth.user.lastName,
              email: auth.user.email,
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
              role: "ADMINFACTORY",
            }}
            validationSchema={UserSchema}
            onSubmit={async (values) => {
              handleUpdateUser(id, { ...values });
              await new Promise((r) => setTimeout(r, 500));
            }}
          >
            {({ errors, touched, values }) => (
              <Form className={cssModules.form}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "40%",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="file-input"
                      type="file"
                      onChange={(e) => {
                        let maxAllowedSize = 2 * 1024 * 1024;
                        if (
                          e.target.files[e.target.files.length - 1].size >
                          maxAllowedSize
                        )
                          return alert("Max file size is 2MB");
                        if (!updateServiceLoading)
                          handleUpdateUser(id, {
                            avatar: e.target.files[e.target.files.length - 1],
                          });
                      }}
                    />
                    <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                      <div className={cssModules.hoverImg}>
                        <div>
                          Click Here
                          <br />
                          To Change Profile Picture
                        </div>
                      </div>
                      <img
                        src={
                          auth.user.avatar !== null ? auth.user.avatar : profile
                        }
                        style={
                          auth.user.avatar === null
                            ? {
                                backgroundColor: "white",
                                padding: "5rem",
                              }
                            : {
                                backgroundColor: "white",
                                width: "25rem",
                                height: "25rem",
                              }
                        }
                      />
                      {/* <Typography sx={{ bgcolor: "white" }}>Edit</Typography> */}
                    </label>
                  </Box>
                  <Box sx={{ width: "60%" }}>
                    <Typography fontSize="1.5rem" style={{ fontWeight: 600 }}>
                      User Information
                    </Typography>
                    <Typography
                      fontSize="1rem"
                      style={{ fontWeight: 600, paddingTop: "1rem" }}
                    >
                      Rename
                    </Typography>
                    {/* Name */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "90%",
                      }}
                    >
                      <div style={{ width: "48%" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label
                            className={cssModules.label}
                            htmlFor="firstName"
                          >
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Input your First Name"
                            className={cssModules.input}
                          />
                          {errors.firstName && touched.firstName ? (
                            <Typography
                              sx={{
                                color: "red",
                                fontSize: "0.75rem",
                              }}
                            >
                              {errors.firstName}
                            </Typography>
                          ) : null}
                        </div>
                      </div>

                      <div style={{ width: "48%" }}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label
                            className={cssModules.label}
                            htmlFor="lastName"
                          >
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Input your Last Name"
                            className={cssModules.input}
                          />
                          {errors.lastName && touched.lastName ? (
                            <Typography
                              sx={{
                                color: "red",
                                fontSize: "0.75rem",
                              }}
                            >
                              {errors.lastName}
                            </Typography>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label className={cssModules.label} htmlFor="email">
                        Email
                      </label>
                      <Field
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className={cssModules.input}
                        disabled
                        style={{ cursor: "no-drop" }}
                      />
                      {errors.email && touched.email ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.email}
                        </Typography>
                      ) : null}
                    </div>

                    <Typography
                      fontSize="1rem"
                      style={{ fontWeight: 600, paddingTop: "1rem" }}
                    >
                      Change Password
                    </Typography>

                    {/* Old Password */}
                    <div
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <label className={cssModules.label} htmlFor="oldPassword">
                        Old Password
                      </label>
                      <Field
                        type={!showOldPassword ? "password" : "text"}
                        name="oldPassword"
                        id="oldPassword"
                        value={values.oldPassword}
                        placeholder="Input Old Password"
                        className={cssModules.input}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 45,
                          cursor: "pointer",
                        }}
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                      {errors.oldPassword && touched.oldPassword ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.oldPassword}
                        </Typography>
                      ) : null}
                    </div>

                    {/* New Password */}
                    <div
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <label className={cssModules.label} htmlFor="newPassword">
                        New Password
                      </label>
                      <Field
                        type={!showNewPassword ? "password" : "text"}
                        name="newPassword"
                        id="newPassword"
                        value={values.newPassword}
                        placeholder="Input New Password"
                        className={cssModules.input}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 45,
                          cursor: "pointer",
                        }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                      {errors.newPassword && touched.newPassword ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.newPassword}
                        </Typography>
                      ) : null}
                    </div>

                    {/* Confirm Password */}
                    <div
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <label
                        className={cssModules.label}
                        htmlFor="confirmNewPassword"
                      >
                        Confirm New Password
                      </label>
                      <Field
                        type={!showConfirmPassword ? "password" : "text"}
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        value={values.confirmNewPassword}
                        placeholder="Input Confirm Password"
                        className={cssModules.input}
                      />
                      <div
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 45,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </div>
                      {errors.confirmNewPassword &&
                      touched.confirmNewPassword ? (
                        <Typography
                          sx={{
                            color: "red",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.confirmNewPassword}
                        </Typography>
                      ) : null}
                    </div>

                    <div style={{ width: "90%" }}>
                      <Button
                        type="submit"
                        sx={{
                          backgroundColor: "#EAB737",
                          ":hover": {
                            bgcolor: "yellow",
                            color: "black",
                          },
                          width: "40%",
                          float: "right",
                          height: "2.75rem",
                          border: "none",
                          fontSize: 18,
                          color: "white",
                          fontWeight: 200,
                          marginTop: 2,
                          cursor: "pointer",
                          borderRadius: "2px",
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </>
  );
}
