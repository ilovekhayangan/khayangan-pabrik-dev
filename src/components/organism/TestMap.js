import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { Box, Modal } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { REGION_FILTER, ZONE_LOCATION } from "@utils/gql/filter/constant";
import { useLazyQuery } from "@apollo/client";

const icon = L.icon({
  iconSize: [20, 31],
  iconAnchor: [10, 41],
  popupAnchor: [0, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  // shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const regionIcon = L.icon({
  iconSize: [50, 51],
  iconAnchor: [10, 41],
  popupAnchor: [15, -40],
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4781/4781517.png",
  // shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

const TestMap = ({
  setEditZone,
  setEditRegion,
  setEditRegionData,
  setEditZoneData,
  setDeleteRegion,
  setDeleteZone,
}) => {
  const [test, setTest] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [zoneData, setZoneData] = useState([]);

  const [
    getRegionData,
    { loading: regionLoading, error: regionError, refetch: regionRefetch },
  ] = useLazyQuery(REGION_FILTER, {
    onCompleted: ({ regionsConnection }) => {
      if (regionsConnection.data.length > 0) {
        setRegionData(
          regionsConnection?.data.map((regions) => ({
            ...regions,
            key: regions.id,
          }))
        );
      } else {
        setRegionData([]);
      }
    },
  });

  const [
    getZoneData,
    { loading: zoneLoading, error: zoneError, refetch: zoneRefetch },
  ] = useLazyQuery(ZONE_LOCATION, {
    onCompleted: ({ zonesConnection }) => {
      if (zonesConnection.data.length > 0) {
        setZoneData(
          zonesConnection?.data.map((zones) => ({
            ...zones,
            key: zones.id,
          }))
        );
      } else {
        setZoneData([]);
      }
    },
  });

  useEffect(() => {
    getRegionData({
      variables: {
        limit: 100,
      },
    });

    getZoneData({
      variables: {
        limit: 100,
      },
    });
  }, []);

  const saveMarkers = (newMarkerCoords) => {
    console.log(test.data);

    const data = [...test.data, newMarkerCoords];
    setTest((prevState) => ({ ...prevState, data }));
  };

  return (
    <div>
      <MapContainer
        className="Map"
        center={{ lat: 0.7893, lng: 113.9213 }}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          height: "70vh",
          width: "100%",
        }}
        worldCopyJump={true}
      >
        <TileLayer
          // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {/* <MyMap saveMarkers={saveMarkers} /> */}

        {zoneData.map((zone, idx) => (
          <div onClick={() => setEditZoneData(zone)}>
            <Marker position={[zone.lat, zone.long]} icon={icon} key={idx}>
              <Popup>
                <b>
                  {zone.region?.name}, {zone.name}
                </b>
                <Box
                  style={{
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <FiEdit
                    onClick={() => setEditZone(true)}
                    style={{
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  />
                  <AiOutlineDelete
                    onClick={() => setDeleteZone(true)}
                    style={{
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </Popup>
            </Marker>
          </div>
        ))}

        {regionData.map((region, idx) => (
          <div onClick={() => setEditRegionData(region)}>
            <Marker
              position={[region.lat, region.long]}
              icon={regionIcon}
              key={idx}
            >
              <Popup>
                <b>{region.name}</b>
                <Box
                  style={{
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <FiEdit
                    onClick={() => setEditRegion(true)}
                    style={{
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  />
                  <AiOutlineDelete
                    onClick={() => setDeleteRegion(true)}
                    style={{
                      fontSize: "1rem",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

function MyMap({ saveMarkers }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      L.marker([lat, lng], { icon }).addTo(map);
      console.log(map);
      saveMarkers([lat, lng]);
    },
  });
  return null;
}

export default TestMap;
