import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { useMutation } from "@apollo/client";
import { CREATE_ZONE } from "@utils/gql/zone/constant";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

import useRegionHook from "@hooks/useRegionHook";

import Buttons from "@components/atoms/Buttons";

import cssModules from "@assets/style/CreateZoneCard.module.css";

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

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

export default function CreateZoneCard({ close, title }) {
  const [location, setLocation] = useState({
    lat: "",
    long: "",
  });

  const CreateZoneSchema = Yup.object().shape({
    name: Yup.string().required(`Name is required`),
    regionId: Yup.string().required(`Region is required`),
    location: Yup.string().required(`Location is required`),
  });

  const [mutationAddData, addData] = useMutation(CREATE_ZONE);

  const { getRegionsData } = useRegionHook();

  const saveMarkers = (e) => {
    setLocation({ lat: e.lat.toString(), long: e.lng.toString() });
  };

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
        <Box
          sx={{
            boxSizing: "border-box",
            p: "1.5rem",
            height: "70vh",
            overflowX: "hidden",
          }}
        >
          <Formik
            initialValues={{
              name: "",
              regionId: "",
              location: "",
              description: "",
            }}
            validationSchema={CreateZoneSchema}
            onSubmit={async (values) => {
              await mutationAddData({
                variables: {
                  input: {
                    name: values.name,
                    regionId: values.regionId,
                    location: values.location,
                    description: values.description,
                    lat: location.lat,
                    long: location.long,
                  },
                },
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
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="e.g. Indonesia"
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
                  <label className={cssModules.label} htmlFor="regionId">
                    Region
                  </label>
                  <Field
                    className={cssModules.input}
                    as="select"
                    name="regionId"
                  >
                    <option
                      className={cssModules.select}
                      style={{ color: "gray" }}
                    >
                      Please, Select Region.{" "}
                    </option>
                    {getRegionsData?.regions?.map((item) => (
                      <option className={cssModules.select} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Field>

                  {errors.regionId && touched.regionId ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.5",
                      }}
                    >
                      {errors.regionId}
                    </Typography>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <label className={cssModules.label} htmlFor="location">
                    Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    id="location"
                    placeholder="e.g. Jawa"
                    className={cssModules.input}
                  />
                  {errors.location && touched.location ? (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "0.5",
                      }}
                    >
                      {errors.location}
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
                    placeholder="e.g. Located in Surabaya, has 5 Racks, etc."
                  />
                </div>

                <Box sx={{ height: "20vh", width: "100%" }}>
                  <MapContainer
                    className="Map"
                    center={{ lat: 0.7893, lng: 113.9213 }}
                    zoom={5}
                    scrollWheelZoom={false}
                    style={{ height: "20vh", width: "100%" }}
                  >
                    <TileLayer
                      // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MyMap
                      saveMarkers={saveMarkers}
                      latitude={location.lat}
                      longitude={location.long}
                    />
                  </MapContainer>
                </Box>

                <Buttons
                  className={cssModules.btnSave}
                  title="Save"
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

  function MyMap({ saveMarkers, latitude, longitude }) {
    let map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        saveMarkers({ lat, lng });
      },
    });
    return (
      <Marker position={[latitude, longitude]} icon={icon}>
        <Popup>
          <b>Your Zone Show Here</b>
        </Popup>
      </Marker>
    );
  }
}
