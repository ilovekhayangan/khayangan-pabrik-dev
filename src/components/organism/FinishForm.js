import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { useMutation } from "@apollo/client";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateZoneCard.module.css";
import {
  GET_REQ_OPENSTACK,
  UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
  CREATE_HYPERVISOR_FROM_REQ_OPENSTACK,
} from "@utils/gql/reqOpenstack/constant";

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

export default function FinishForm({ close, title, hypervisorData }) {
  const CreateZoneSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    endpoint: Yup.string().required(`Endpoint is required`),
  });

  console.log(hypervisorData);

  const [mutationAddData, addData] = useMutation(
    CREATE_HYPERVISOR_FROM_REQ_OPENSTACK
  );

  const [updateStatus, { loading: updateProjectLoading }] = useMutation(
    UPDATE_STATUS_HYPERVISOR_FROM_REQ_OPENSTACK,
    {
      refetchQueries: [{ query: GET_REQ_OPENSTACK }],
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
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #D8D8D8",
            boxSizing: "border-box",
            p: "1.5rem",
          }}
        >
          <Typography fontSize="1.5rem" style={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <ClearIcon onClick={close} sx={{ cursor: "pointer" }} />
        </Box>

        {/* Form Card */}
        <Box sx={{ boxSizing: "border-box", p: "1.5rem" }}>
          <Formik
            initialValues={{
              name: "",
              endpoint: "",
              description: "",
              auth: "",
            }}
            validationSchema={CreateZoneSchema}
            onSubmit={async (values) => {
              await mutationAddData({
                variables: {
                  input: {
                    name: values.name,
                    endpoint: values.endpoint,
                    description: values.description,
                    auth: hypervisorData.name,
                  },
                },
              });
              updateStatus({
                variables: {
                  id: hypervisorData.id,
                  input: {
                    reqHypervisorStatus: "COMPLETE",
                  },
                },
                refetchQueries: [{ query: GET_REQ_OPENSTACK }],
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
                    Hypervisor Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Hypervisor Name"
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
                  <label className={cssModules.label} htmlFor="endpoint">
                    Endpoint
                  </label>
                  <Field
                    type="text"
                    name="endpoint"
                    id="endpoint"
                    placeholder="Endpoint"
                    className={cssModules.input}
                  />
                  {errors.endpoint && touched.endpoint ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.5",
                      }}
                    >
                      {errors.endpoint}
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
