import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MapLocation {
  id: string;
  coordinates: [number, number];
  type: 'pickup' | 'delivery' | 'terminal';
  label: string;
  status?: 'pending' | 'in-transit' | 'completed';
}

interface TmsMapProps {
  locations?: MapLocation[];
  showRoutes?: boolean;
  mapboxToken?: string;
}

export function TmsMap({ locations = [], showRoutes = true, mapboxToken }: TmsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(mapboxToken || '');
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);

  // Sample locations for demo
  const defaultLocations: MapLocation[] = [
    {
      id: 'pickup-1',
      coordinates: [-118.2437, 34.0522], // Los Angeles
      type: 'pickup',
      label: 'ABC Logistics - Pickup',
      status: 'completed'
    },
    {
      id: 'delivery-1', 
      coordinates: [-112.0740, 33.4484], // Phoenix
      type: 'delivery',
      label: 'XYZ Warehouse - Delivery',
      status: 'in-transit'
    },
    {
      id: 'terminal-1',
      coordinates: [-117.8311, 33.6839], // Riverside (intermediate)
      type: 'terminal',
      label: 'Regional Terminal',
      status: 'pending'
    }
  ];

  const mapLocations = locations.length > 0 ? locations : defaultLocations;

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-115.1398, 34.0522], // Centered between LA and Phoenix
        zoom: 6,
        projection: 'globe' as any
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        // Add markers for each location
        mapLocations.forEach((location) => {
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.style.width = '12px';
          markerElement.style.height = '12px';
          markerElement.style.borderRadius = '50%';
          markerElement.style.border = '2px solid white';
          markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          
          // Color based on type and status
          if (location.type === 'pickup') {
            markerElement.style.backgroundColor = location.status === 'completed' ? '#22c55e' : '#3b82f6';
          } else if (location.type === 'delivery') {
            markerElement.style.backgroundColor = location.status === 'completed' ? '#22c55e' : '#ef4444';
          } else {
            markerElement.style.backgroundColor = '#f59e0b';
          }

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div class="p-2">
              <h3 class="font-medium">${location.label}</h3>
              <p class="text-sm text-gray-600">${location.type.charAt(0).toUpperCase() + location.type.slice(1)}</p>
              ${location.status ? `<span class="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 mt-1">${location.status}</span>` : ''}
            </div>`
          );

          new mapboxgl.Marker(markerElement)
            .setLngLat(location.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
        });

        // Add route line if showRoutes is true
        if (showRoutes && mapLocations.length > 1) {
          const coordinates = mapLocations.map(loc => loc.coordinates);
          
          map.current!.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': coordinates
              }
            }
          });

          map.current!.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.8
            }
          });
        }

        // Fit map to show all locations
        if (mapLocations.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          mapLocations.forEach(location => {
            bounds.extend(location.coordinates);
          });
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [token, mapLocations, showRoutes]);

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="w-full h-96">
        <CardHeader>
          <CardTitle>Map Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-center text-muted-foreground">
            Enter your Mapbox public token to view the route map
          </p>
          <div className="flex gap-2 w-full max-w-sm">
            <Input
              placeholder="Mapbox public token (pk.)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
            />
            <Button onClick={handleTokenSubmit}>
              Load Map
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Get your token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-medium text-sm mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
            <span>Pickup Location</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span>Delivery Location</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
            <span>Terminal/Stop</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Route Info */}
      {mapLocations.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{mapLocations.length} stops</Badge>
            <span className="text-muted-foreground">~425 miles</span>
          </div>
        </div>
      )}
    </div>
  );
}