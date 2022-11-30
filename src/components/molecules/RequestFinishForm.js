import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { useMutation } from "@apollo/client";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateZoneCard.module.css";
import {
  REQ_OPENS_PROJECT,
  UPDATE_STATUS,
  CREATE_PROJECT,
} from "@utils/gql/reqOpensProject/constant";

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

export default function RequestFinishForm({ close, hypervisorData }) {
  const CreateProjectSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
  });

  const [mutationAddData, addData] = useMutation(CREATE_PROJECT);

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_STATUS,
    {
      refetchQueries: [{ query: REQ_OPENS_PROJECT }],
    }
  );

  return (
    <>
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          bgcolor: "#00000050",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 88,
        }}
        onClick={close}
      ></Box>

      {/* Card */}
      <Box
        sx={{
          width: "25rem",
          height: "auto",
          bgcolor: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <ClearIcon
            onClick={close}
            sx={{ cursor: "pointer", marginTop: "1rem", marginRight: "1rem" }}
          />
        </Box>

        {/* Form Card */}
        <Box
          sx={{ boxSizing: "border-box", p: "0.25rem 1.5rem 1.5rem 1.5rem" }}
        >
          <Formik
            initialValues={{
              name: "",
              description: "",
            }}
            validationSchema={CreateProjectSchema}
            onSubmit={async (values) => {
              await mutationAddData({
                variables: {
                  input: {
                    name: values.name,
                    description: values.description,
                  },
                },
              });
              updateStatus({
                variables: {
                  id: hypervisorData.id,
                  input: {
                    reqProjectStatus: "COMPLETE",
                  },
                },
                refetchQueries: [{ query: REQ_OPENS_PROJECT }],
              });
              close();
            }}
          >
            {({ errors, touched }) => (
              <Form className={cssModules.form}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <label className={cssModules.label} htmlFor="name">
                    Project Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Project Name"
                    className={cssModules.input}
                  />
                  {errors.name && touched.name ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.5",
                      }}
                    >
                      {errors.name}
                    </Typography>
                  ) : null}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <MyTextArea
                    label="Description"
                    name="description"
                    id="description"
                    rows="6"
                    placeholder="Description"
                  />
                </div>

                <Buttons
                  className={cssModules.btnSave}
                  title="Submit"
                  variant="contained"
                  bg="#EAB737"
                  color="white"
                  width="100%"
                  height="2.75rem"
                  fWeight={200}
                  fSize={18}
                  radius="2px"
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}
