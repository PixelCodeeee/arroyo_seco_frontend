import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Loader } from 'lucide-react';
import '../styles/GoogleMap.css';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '25px'
};

const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332
};

const libraries = ['places']; // Necesario para Geocoder

function GoogleMapComponent({ ubicacion, nombreNegocio }) {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Siempre llamamos al hook, pero con key vacía si no existe
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
    preventGoogleFontsLoading: true,
  });

  const hasValidKey = !!apiKey && apiKey !== 'dummy-key';

  // Geocodificación
  useEffect(() => {
    if (!isLoaded || !hasValidKey || !ubicacion || !window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();

    setIsGeocoding(true);

    geocoder.geocode({ address: ubicacion }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const loc = results[0].geometry.location;
        const newPos = { lat: loc.lat(), lng: loc.lng() };
        setCenter(newPos);
        setMarkerPosition(newPos);
      } else {
        console.warn('Geocoding falló:', status);
      }
      setIsGeocoding(false);
    });
  }, [isLoaded, hasValidKey, ubicacion]);

  // Fallback cuando no hay API key o hay error de carga
  if (!hasValidKey || loadError) {
    return (
      <div className="google-map-wrapper map-fallback">
        <img
          src="/images/pan.png"
          alt="Mapa de ubicación"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <div className="map-fallback-overlay">
          <MapPin size={20} />
          <div>
            <strong>{nombreNegocio}</strong>
            <small>{ubicacion || 'Ubicación disponible'}</small>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (!isLoaded || isGeocoding) {
    return (
      <div className="google-map-wrapper map-loading">
        <Loader size={40} className="spinner-icon" />
        <p>{isGeocoding ? 'Buscando ubicación...' : 'Cargando mapa...'}</p>
      </div>
    );
  }

  // Mapa real
  return (
    <div className="google-map-wrapper">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        }}
      >
        <Marker
          position={markerPosition}
          title={nombreNegocio}
          animation={window.google.maps.Animation.DROP}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#e3008c',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 3,
            scale: 10,
          }}
        />
      </GoogleMap>

      <div className="map-address-overlay">
        <MapPin size={16} />
        <span>{ubicacion}</span>
      </div>
    </div>
  );
}

export default GoogleMapComponent;