import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FarmMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    center?: [number, number];
}

export default function FarmMap({ onLocationSelect, center }: FarmMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerInstance = useRef<L.Marker | null>(null);

    // Watch for external center changes
    useEffect(() => {
        if (mapInstance.current && center) {
            mapInstance.current.flyTo(center, 10);

            // Move marker to center
            if (markerInstance.current) {
                markerInstance.current.setLatLng(center);
            } else {
                markerInstance.current = L.marker(center).addTo(mapInstance.current!);
            }
        }
    }, [center]);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            // Initialize map
            const initialView = center || [20.5937, 78.9629];
            const map = L.map(mapRef.current).setView(initialView, 5);
            mapInstance.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', (e) => {
                const { lat, lng } = e.latlng;

                // Update marker
                if (markerInstance.current) {
                    markerInstance.current.setLatLng([lat, lng]);
                } else {
                    markerInstance.current = L.marker([lat, lng]).addTo(map);
                }

                // Fly to location
                map.flyTo([lat, lng], map.getZoom());

                // Callback
                onLocationSelect(lat, lng);
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []); // Init once

    return <div ref={mapRef} className="h-full w-full z-0" />;
}
