import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, LoaderCircle, MapPin, Navigation } from 'lucide-react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const HYDERABAD_COORDINATES = { lat: 17.385, lng: 78.4867 };
const ISSUES_ENDPOINT = import.meta.env.VITE_ISSUES_MAP_URL || 'http://localhost:5000/api/issues';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userLocationIcon = L.divIcon({
  className: 'hero-map-user-marker',
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:22px;height:22px;">
      <span style="position:absolute;inset:-8px;border-radius:9999px;background:rgba(37,99,235,0.2);animation:pulse 2s ease-in-out infinite;"></span>
      <span style="width:14px;height:14px;border-radius:9999px;background:#2563eb;border:3px solid #fff;box-shadow:0 6px 16px rgba(37,99,235,0.35);"></span>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -12],
});

function getCategoryIcon(category) {
  const normalized = String(category || '').toLowerCase();

  const categoryConfig = {
    pothole: { color: '#f97316' },
    garbage: { color: '#16a34a' },
    waste: { color: '#16a34a' },
    water: { color: '#0284c7' },
    flooding: { color: '#0284c7' },
    streetlight: { color: '#eab308' },
    lighting: { color: '#eab308' },
    road: { color: '#dc2626' },
  };

  const matchedEntry = Object.entries(categoryConfig).find(([key]) => normalized.includes(key));
  const { color } = matchedEntry?.[1] || { color: '#7c3aed' };

  return L.divIcon({
    className: 'hero-map-issue-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:18px;height:18px;">
        <span style="position:absolute;inset:-5px;border-radius:9999px;background:${color};opacity:0.28;"></span>
        <span style="position:absolute;inset:0;border-radius:9999px;background:${color};border:2px solid rgba(255,255,255,0.96);box-shadow:0 6px 16px rgba(15,23,42,0.25);"></span>
        <span style="position:relative;width:6px;height:6px;border-radius:9999px;background:#ffffff;"></span>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 16, {
      animate: true,
      duration: 1.2,
    });
  }, [center, map]);

  return null;
}

function StatusPill({ tone, children }) {
  const toneClasses = {
    info: 'bg-blue-500/10 text-blue-700 border-blue-200',
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-500/10 text-amber-700 border-amber-200',
    danger: 'bg-rose-500/10 text-rose-700 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses[tone] || toneClasses.info}`}>
      {children}
    </span>
  );
}

function getStatusTone(status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized.includes('resolved') || normalized.includes('closed')) {
    return 'success';
  }

  if (normalized.includes('progress') || normalized.includes('assigned')) {
    return 'warning';
  }

  if (normalized.includes('rejected') || normalized.includes('failed')) {
    return 'danger';
  }

  return 'info';
}

export default function HeroIssuesMap({ isDark = false }) {
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();
    let isActive = true;

    async function loadIssues() {
      try {
        setIssuesLoading(true);
        setIssuesError('');

        const response = await fetch(ISSUES_ENDPOINT, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Issues request failed with status ${response.status}.`);
        }

        const payload = await response.json();
        if (!isActive) {
          return;
        }

        const normalizedIssues = Array.isArray(payload)
          ? payload.filter(
              (issue) =>
                typeof issue?.latitude === 'number' &&
                typeof issue?.longitude === 'number',
            )
          : [];

        setIssues(normalizedIssues);
      } catch (error) {
        if (error.name === 'AbortError' || !isActive) {
          return;
        }

        setIssuesError('Unable to load live civic issues right now.');
      } finally {
        if (isActive) {
          setIssuesLoading(false);
        }
      }
    }

    loadIssues();

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(HYDERABAD_COORDINATES);
      setLocationError('Geolocation is not supported on this device.');
      setLocationLoading(false);
      return undefined;
    }

    let isActive = true;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!isActive) {
          return;
        }

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
        setLocationLoading(false);
      },
      () => {
        if (!isActive) {
          return;
        }

        setUserLocation(HYDERABAD_COORDINATES);
        setLocationError('Location access denied. Showing Hyderabad instead.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );

    return () => {
      isActive = false;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const mapCenter = userLocation || HYDERABAD_COORDINATES;
  const mapIssues = useMemo(() => issues, [issues]);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border ${isDark ? 'border-slate-700 bg-slate-950/80' : 'border-slate-200 bg-white/90'} shadow-2xl`}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.65; }
          50% { transform: scale(1.18); opacity: 0.15; }
        }
        .hero-leaflet-map .leaflet-container {
          height: 350px;
          width: 100%;
          border-radius: 1.5rem;
          background: #dbeafe;
        }
        .hero-leaflet-map .leaflet-control-attribution {
          font-size: 10px;
        }
        .hero-leaflet-map .leaflet-popup-content-wrapper {
          border-radius: 1rem;
        }
      `}</style>

      <div className={`pointer-events-none absolute inset-x-0 top-0 z-[500] h-28 bg-gradient-to-b ${isDark ? 'from-slate-950 via-slate-950/60 to-transparent' : 'from-white via-white/75 to-transparent'}`} />

      <div className="absolute left-4 top-4 z-[600] flex max-w-[70%] flex-wrap gap-2">
        {issuesLoading ? (
          <StatusPill tone="info">
            <LoaderCircle className="mr-2 h-3.5 w-3.5 animate-spin" />
            Loading issues
          </StatusPill>
        ) : (
          <StatusPill tone="info">{mapIssues.length} mapped issues</StatusPill>
        )}

        {locationLoading ? (
          <StatusPill tone="info">
            <Navigation className="mr-2 h-3.5 w-3.5" />
            Detecting location
          </StatusPill>
        ) : (
          <StatusPill tone="success">
            <MapPin className="mr-2 h-3.5 w-3.5" />
            {userLocation ? 'Centered on you' : 'Centered on Hyderabad'}
          </StatusPill>
        )}
      </div>

      <div className="hero-leaflet-map">
        <MapContainer
          center={mapCenter}
          zoom={16}
          scrollWheelZoom={false}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={mapCenter} />

          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {mapIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={getCategoryIcon(issue.category)}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900">{issue.title || 'Civic issue'}</div>
                  <div className="text-sm text-slate-600">
                    Status: <span className="font-medium capitalize">{String(issue.status || 'open').replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[600] flex flex-col gap-2 p-4">
        {issuesError && (
          <div className="rounded-2xl border border-amber-200 bg-white/92 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg backdrop-blur">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            {issuesError}
          </div>
        )}
        {locationError && (
          <div className="rounded-2xl border border-blue-200 bg-white/92 px-4 py-3 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
}
