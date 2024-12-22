import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const MapContainer = () => {
  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: 37.5665, // 서울의 위도
    lng: 126.9780 // 서울의 경도
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBA7J9N7TZa_PWbMFZz7m5gRcFXXu2OulM">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      />
    </LoadScript>
  );
};

export default MapContainer;
