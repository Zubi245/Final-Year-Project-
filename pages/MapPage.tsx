import React, { useEffect, useState, useCallback } from 'react';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { getSpots } from '../mockService';
import { Spot } from '../types';
import { OfflineMap } from './offlineMap';

const containerStyle = { width: '100%', height: '100%' };

// Pakistan center
const center = { lat: 30.3753, lng: 69.3451 };

// Exact Pakistan geo coordinates from GeoJSON source
const pakistanCoords = [
  [
    [75.158028,37.133031],[75.896897,36.666806],[76.192848,35.898403],[77.837451,35.49401],
    [76.871722,34.653544],[75.757061,34.504913],[74.240203,34.748887],[73.749948,34.317699],
    [74.104294,33.441473],[74.451559,32.7649],[75.258642,32.271105],[74.405929,31.692639],
    [74.42138,30.979815],[73.450638,29.976413],[72.823752,28.961592],[71.777666,27.91318],
    [70.616496,27.989196],[69.514393,26.940966],[70.168927,26.491872],[70.282873,25.722229],
    [70.844699,25.215102],[71.04324,24.356524],[68.842599,24.359134],[68.176645,23.691965],
    [67.443667,23.944844],[67.145442,24.663611],[66.372828,25.425141],[64.530408,25.237039],
    [62.905701,25.218409],[61.497363,25.078237],[61.874187,26.239975],[63.316632,26.756532],
    [63.233898,27.217047],[62.755426,27.378923],[62.72783,28.259645],[61.771868,28.699334],
    [61.369309,29.303276],[60.874248,29.829239],[62.549857,29.318572],[63.550261,29.468331],
    [64.148002,29.340819],[64.350419,29.560031],[65.046862,29.472181],[66.346473,29.887943],
    [66.381458,30.738899],[66.938891,31.304911],[67.683394,31.303154],[67.792689,31.58293],
    [68.556932,31.71331],[68.926677,31.620189],[69.317764,31.901412],[69.262522,32.501944],
    [69.687147,33.105499],[70.323594,33.358533],[69.930543,34.02012],[70.881803,33.988856],
    [71.156773,34.348911],[71.115019,34.733126],[71.613076,35.153203],[71.498768,35.650563],
    [71.262348,36.074388],[71.846292,36.509942],[72.920025,36.720007],[74.067552,36.836176],
    [74.575893,37.020841],[75.158028,37.133031]
  ]
];

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const MapPage = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [province, setProvince] = useState('All');
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    getSpots().then(setSpots);
  }, []);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const filteredSpots =
    province === 'All'
      ? spots
      : spots.filter(s => s.region === province);

  const explainSpot = (spot: Spot) => [
    `High rating (${spot.rating})`,
    'Popular tourist destination',
    'Scenic & cultural value',
    'Good accessibility',
  ];

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);

    // 🎯 Fit map to geo border bounds
    const bounds = new google.maps.LatLngBounds();
    pakistanCoords[0].forEach(([lng, lat]) => {
      bounds.extend({ lat, lng });
    });
    map.fitBounds(bounds);

    // 🔒 restrict panning
    map.setOptions({
      restriction: { latLngBounds: bounds, strictBounds: true },
    });

    // 🇵🇰 Draw exact country border polygon
    const borderPolygon = new google.maps.Polygon({
      paths: pakistanCoords[0].map(([lng, lat]) => ({ lat, lng })),
      strokeColor: '#008000',
      strokeOpacity: 0.9,
      strokeWeight: 4,      // 🔥 thicker bold border
      fillOpacity: 0.0,
    });
    borderPolygon.setMap(map);
  }, []);

  useEffect(() => {
    if (!mapRef || !online) return;

    const markers = filteredSpots.map(spot => {
      const marker = new google.maps.Marker({
        position: {
          lat: spot.coordinates.lat,
          lng: spot.coordinates.lng,
        },
      });
      marker.addListener('click', () => setSelectedSpot(spot));
      return marker;
    });

    const cluster = new MarkerClusterer({ map: mapRef, markers });
    return () => cluster.clearMarkers();
  }, [mapRef, filteredSpots, online]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="md:w-80 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Tourist Spots</h2>
          <select
            className="mt-2 w-full border p-1 rounded text-sm"
            value={province}
            onChange={e => setProvince(e.target.value)}
          >
            <option>All</option>
            <option>Punjab</option>
            <option>Sindh</option>
            <option>Khyber Pakhtunkhwa</option>
            <option>Balochistan</option>
            <option>Gilgit-Baltistan</option>
          </select>
        </div>
        {filteredSpots.map(spot => (
          <div
            key={spot.id}
            onClick={() => setSelectedSpot(spot)}
            className="p-3 border-b cursor-pointer hover:bg-emerald-50"
          >
            <strong>{spot.name}</strong>
            <p className="text-xs text-gray-500">{spot.region}</p>
          </div>
        ))}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {!online && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs z-10">
            Offline Mode Enabled
          </div>
        )}

        {online ? (
          <LoadScript googleMapsApiKey={GOOGLE_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={6}
              onLoad={onMapLoad}
            >
              {selectedSpot && (
                <InfoWindow
                  position={{
                    lat: selectedSpot.coordinates.lat,
                    lng: selectedSpot.coordinates.lng,
                  }}
                  onCloseClick={() => setSelectedSpot(null)}
                >
                  <div className="w-60">
                    <img
                      src={selectedSpot.imageUrl}
                      className="w-full h-28 object-cover rounded"
                    />
                    <h3 className="font-bold mt-2">{selectedSpot.name}</h3>
                    <ul className="text-xs mt-1 list-disc ml-4">
                      {explainSpot(selectedSpot).map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        ) : (
          <OfflineMap spots={filteredSpots} />
        )}
      </div>
    </div>
  );
};
