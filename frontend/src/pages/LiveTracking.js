import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

// Premium Zomato-inspired Custom Icon for the moving bike
const createBikeIcon = () => {
    return L.divIcon({
        className: 'custom-bike-marker',
        html: `
            <div class="pulse-container">
                <div class="pulse-ring"></div>
                <div class="pulse-dot">
                    <span class="pulse-icon" style="font-size:12px; margin-left:1px;">🏍️</span>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

// Premium Landmark Icon for cities using user images
const createLandmarkIcon = (imageUrl) => {
    return L.divIcon({
        className: 'custom-landmark-marker',
        html: `
            <div class="landmark-pin-image" style="background-image: url('${encodeURI(imageUrl)}')"></div>
        `,
        iconSize: [46, 58],
        iconAnchor: [23, 58],
        popupAnchor: [0, -58]
    });
};

// Start Point Icon
const createStartIcon = () => {
    return L.divIcon({
        className: 'custom-landmark-marker',
        html: `<div class="landmark-pin start-pin"><span>🏪</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
};

// Destiny Point Icon
const createDestinyIcon = () => {
    return L.divIcon({
        className: 'custom-landmark-marker',
        html: `<div class="landmark-pin destiny-pin"><span>🏠</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
};

// Cities to display in Global Fleet view
const cityLandmarks = [
    { id: 'city-1', name: 'Kurnool', lat: 15.8281, lng: 78.0373, status: 'Active Hub', image: '/assets/landmarks/kondareddyfort.jpeg' },
    { id: 'city-2', name: 'Nandyal', lat: 15.4800, lng: 78.4833, status: 'Active Hub', image: '/assets/landmarks/nandyal.jpeg' },
    { id: 'city-3', name: 'Kadapa', lat: 14.4673, lng: 78.8242, status: 'Active Hub', image: '/assets/landmarks/Kadapa.jpg' },
    { id: 'city-4', name: 'Vijayawada', lat: 16.5062, lng: 80.6480, status: 'Active Hub', image: '/assets/landmarks/vijawada.jpg' },
    { id: 'city-5', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, status: 'Active Hub', image: '/assets/landmarks/Vizag Beach Road.jpeg' },
    { id: 'city-6', name: 'Vizag', lat: 17.6868, lng: 83.2185, status: 'Active Hub', image: '/assets/landmarks/Vizag Beach Road.jpeg' },
    { id: 'city-7', name: 'Guntur', lat: 16.3067, lng: 80.4365, status: 'Active Hub', image: '/assets/landmarks/guntur.jpg' },
    { id: 'city-8', name: 'Tirupati', lat: 13.6288, lng: 79.4192, status: 'Active Hub', image: '/assets/landmarks/tirupati.jpg' },
    { id: 'city-9', name: 'Nellore', lat: 14.4426, lng: 79.9865, status: 'Active Hub', image: '/assets/landmarks/nellore.jpg' },
    { id: 'city-10', name: 'Rajamundry', lat: 16.9891, lng: 81.7836, status: 'Active Hub', image: '/assets/landmarks/rajamundry.jpg' },
    { id: 'city-11', name: 'Kakinada', lat: 16.9322, lng: 82.2381, status: 'Active Hub', image: '/assets/landmarks/kakinada.jpg' },
    { id: 'city-12', name: 'Ananthapur', lat: 14.6819, lng: 77.6006, status: 'Active Hub', image: '/assets/landmarks/ananthapur.jpg' },
    { id: 'city-13', name: 'Ongole', lat: 15.5057, lng: 80.0499, status: 'Active Hub', image: '/assets/landmarks/ongole.jpg' }
];

// Helper function to calculate distance in km using Haversine formula (fallback only now)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Explicit destinations, distances, and speeds defined by business logic IF originating from Kurnool (legacy logic fallback)
const kurnoolDestinationsInfo = {
    'Nandyal': { coords: [15.4800, 78.4833], distance: 78, speed: 40 },
    'Kadapa': { coords: [14.4673, 78.8242], distance: 180, speed: 68 },
    'Vijayawada': { coords: [16.5062, 80.6480], distance: 349, speed: 92 },
    'Vizag': { coords: [17.6868, 83.2185], distance: 704, speed: 133 },
    'Visakhapatnam': { coords: [17.6868, 83.2185], distance: 704, speed: 133 },
    'Guntur': { coords: [16.3067, 80.4365], distance: 430, speed: 48 },
    'Tirupati': { coords: [13.6288, 79.4192], distance: 551, speed: 70 },
    'Nellore': { coords: [14.4426, 79.9865], distance: 809, speed: 122 },
    'Rajamundry': { coords: [16.9891, 81.7836], distance: 312, speed: 99 },
    'Kakinada': { coords: [16.9322, 82.2381], distance: 720, speed: 122 },
    'Ananthapur': { coords: [14.6819, 77.6006], distance: 445, speed: 86 },
    'Ongole': { coords: [15.5057, 80.0499], distance: 1000, speed: 94 }
};


const LiveTracking = () => {
    const { user } = useAuth();
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState(bookingId ? 'track' : 'global');
    const [progress, setProgress] = useState(0);
    const [activeBooking, setActiveBooking] = useState(null);
    const [allActiveBookings, setAllActiveBookings] = useState([]);
    const [userBookings, setUserBookings] = useState([]);
    const [loadingBooking, setLoadingBooking] = useState(true);
    const [panelOpen, setPanelOpen] = useState(true);          // admin side panel
    const [multiProgress, setMultiProgress] = useState({});   // per-booking progress map

    // Fetch user bookings on mount or auth change
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setLoadingBooking(false);
                return;
            }
            try {
                const idToken = await user.getIdToken();
                const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (response.ok) {
                    const data = await response.json();

                    // Accept pending, confirmed, shipped, and booked within the last 1 day
                    const activeOnes = data.data.filter(b => {
                        const s = (b.status || '').toLowerCase();
                        const isNotClosed = s !== 'delivered' && s !== 'cancelled';
                        const createdDate = new Date(b.created_at || b.createdAt || 0).getTime();
                        const isRecent = (Date.now() - createdDate) <= 24 * 60 * 60 * 1000;
                        return isNotClosed && isRecent;
                    });

                    setAllActiveBookings(activeOnes);

                    // Separate ONLY this user's bookings for per-user selector
                    const myBookings = activeOnes.filter(b => b.email === user.email);
                    setUserBookings(myBookings);

                    if (bookingId) {
                        const target = activeOnes.find(b => b.id === bookingId || b.booking_id === bookingId);
                        if (target) {
                            setActiveBooking(target);
                            setViewMode('track');
                        }
                    } else {
                        if (myBookings.length > 0) {
                            myBookings.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
                            setActiveBooking(myBookings[0]);
                            setViewMode('track'); // auto-switch to track when user has bookings
                        } else if (user?.email === 'admin@3535.com' && activeOnes.length > 0) {
                            activeOnes.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
                            setActiveBooking(activeOnes[0]);
                            setViewMode('track'); // auto-switch to track for admin too
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching bookings for tracking:", err);
            } finally {
                setLoadingBooking(false);
            }
        };

        fetchBookings();
    }, [user, bookingId]);


    // Reset progress when active booking changes
    useEffect(() => {
        setProgress(0);
    }, [activeBooking?.id]);

    // Parse start and destination info from active booking (defaulting to Kurnool -> Nandyal if parsing fails/unknown)
    let routeStartName = 'Kurnool';
    let routeDestName = 'Nandyal';

    if (activeBooking && activeBooking.startLocation) {
        routeStartName = activeBooking.startLocation;
    }

    if (activeBooking && activeBooking.location) {
        routeDestName = activeBooking.location;
    }

    // Lookup coordinates from the cityLandmarks array definition
    const startCityDef = cityLandmarks.find(c => c.name.toLowerCase() === routeStartName.toLowerCase()) || cityLandmarks[0];
    const destCityDef = cityLandmarks.find(c => c.name.toLowerCase() === routeDestName.toLowerCase()) || cityLandmarks[1];

    const startCoords = [startCityDef.lat, startCityDef.lng];
    const destCoords = [destCityDef.lat, destCityDef.lng];

    // Calculate routing distance and speed logically
    let totalRouteDistance = 0;
    let trackingSpeed = 50; // Default 50 km/h

    // If starting from Kurnool and using one of the explicitly requested destinations
    if (routeStartName.toLowerCase() === 'kurnool') {
        const legacyMatch = Object.keys(kurnoolDestinationsInfo).find(k => k.toLowerCase() === routeDestName.toLowerCase());
        if (legacyMatch) {
            totalRouteDistance = kurnoolDestinationsInfo[legacyMatch].distance;
            trackingSpeed = kurnoolDestinationsInfo[legacyMatch].speed;
        } else {
            totalRouteDistance = calculateDistance(startCoords[0], startCoords[1], destCoords[0], destCoords[1]);
        }
    } else {
        // Dynamic dynamic pair, calculate geometric distance
        totalRouteDistance = calculateDistance(startCoords[0], startCoords[1], destCoords[0], destCoords[1]);
        // Roughly scale speed to distance so it arrives reasonably (optional heuristic)
        trackingSpeed = totalRouteDistance > 300 ? 90 : (totalRouteDistance > 100 ? 65 : 45);
    }

    const routePoints = [startCoords, destCoords];

    // Central coordinates for Andhra Pradesh view
    const globalCenter = useMemo(() => [16.0, 80.0], []);
    const trackCenter = useMemo(() => [(startCoords[0] + destCoords[0]) / 2, (startCoords[1] + destCoords[1]) / 2], [startCoords[0], startCoords[1], destCoords[0], destCoords[1]]);
    const routeId = useMemo(() => `${routeStartName}-${routeDestName}`, [routeStartName, routeDestName]);

    // Internal component to handle view stability
    const MapViewHandler = ({ center, routeId }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.fitBounds([startCoords, destCoords], { padding: [60, 60], maxZoom: 12 });
            }
        }, [routeId, map]); // Only fit bounds when the route changes
        return null;
    };

    useEffect(() => {
        let interval;
        if (viewMode === 'track' && activeBooking) {
            // Virtual Simulation Scale
            const timeScale = 60; // 1 real second = 1 virtual minute for demo

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100; // Arrived
                    const stepSize = 100 / ((totalRouteDistance / trackingSpeed) * 60 * 60 / timeScale);
                    return Math.min(prev + stepSize, 100);
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [viewMode, activeBooking, totalRouteDistance, trackingSpeed]);

    // Simulate independent progress for EACH active booking (admin sees all, users see their own)
    useEffect(() => {
        const bookingsToTrack = user?.email === 'admin@3535.com'
            ? allActiveBookings
            : userBookings;

        if (bookingsToTrack.length === 0) return;

        setMultiProgress(prev => {
            const next = { ...prev };
            bookingsToTrack.forEach(b => {
                if (next[b.id] === undefined) next[b.id] = Math.random() * 10;
            });
            return next;
        });

        const interval = setInterval(() => {
            setMultiProgress(prev => {
                const next = { ...prev };
                bookingsToTrack.forEach(b => {
                    const cur = next[b.id] ?? 0;
                    if (cur >= 100) { next[b.id] = 100; return; }
                    // Use actual route speed from kurnoolDestinationsInfo if available
                    const destKey = Object.keys(kurnoolDestinationsInfo).find(
                        k => k.toLowerCase() === (b.location || '').toLowerCase()
                    );
                    const routeInfo = destKey ? kurnoolDestinationsInfo[destKey] : null;
                    const speed = routeInfo ? routeInfo.speed : 60;
                    const dist = routeInfo ? routeInfo.distance : 150;
                    // timeScale: 1s real = simulate proportional movement
                    const stepPct = (speed / dist) * (100 / 3600) * 2; // 2x speed for demo
                    next[b.id] = Math.min(cur + stepPct, 100);
                });
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user, allActiveBookings, userBookings]);

    // Simple interpolation for straight line route simulation
    const currentLat = startCoords[0] + (destCoords[0] - startCoords[0]) * (progress / 100);
    const currentLng = startCoords[1] + (destCoords[1] - startCoords[1]) * (progress / 100);
    const currentPosition = [currentLat, currentLng];

    const distanceTraveled = (progress / 100) * totalRouteDistance;
    const distanceRemaining = Math.max(0, totalRouteDistance - distanceTraveled).toFixed(1);

    // Time remaining based on exact mapping speed configured
    const timeRemainingHours = distanceRemaining / trackingSpeed;
    const timeRemainingMins = Math.floor(timeRemainingHours * 60);

    return (
        <div className="live-tracking-container" style={{ height: 'calc(100vh - 80px)', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <style>
                {`
                /* Hide generic map attribution for a cleaner interface */
                .leaflet-control-attribution {
                    display: none !important;
                }
                .custom-bike-marker {background: transparent; border: none; }
                .custom-landmark-marker {background: transparent; border: none; }
                .landmark-pin {
                    font-size: 24px;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
                    transform: translateY(-10px);
                    transition: transform 0.2s;
                }
                .landmark-pin:hover {
                    transform: translateY(-15px) scale(1.1);
                }
                .landmark-pin-image {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    border: 3px solid #0EA5E9;
                    background-size: cover;
                    background-position: center;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                    position: relative;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                .landmark-pin-image::after {
                    content: '';
                    position: absolute;
                    bottom: -14px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 14px 10px 0;
                    border-style: solid;
                    border-color: #0EA5E9 transparent transparent transparent;
                }
                .landmark-pin-image:hover {
                    transform: translateY(-15px) scale(1.15);
                    box-shadow: 0 10px 20px rgba(226, 55, 68, 0.4);
                }
                .start-pin {font-size: 28px; }
                .destiny-pin {font-size: 28px; }

                .pulse-container {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 3px solid #87ceeb; /* Accent styling for bike pulse */
                    animation: pulsate 1.5s ease-out infinite;
                    opacity: 0;
                }
                .pulse-dot {
                    position: relative;
                    width: 25px;
                    height: 25px;
                    background-color: #87ceeb; /* Match pulse ring */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(135, 206, 235, 0.4);
                    z-index: 2;
                    color: white;
                }
                @keyframes pulsate {
                    0% { transform: scale(0.6); opacity: 1; }
                    100% {transform: scale(1.6); opacity: 0; }
                }
                .tracking-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    border: 1px solid #eee;
                }
                .tracking-popup h3 {
                    color: #0EA5E9 !important;
                    font-weight: 800;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 5px;
                }
                .view-tabs {
                    display: flex;
                    gap: 15px;
                }
                .view-tab {
                    padding: 10px 20px;
                    border-radius: 100px;
                    font-weight: 700;
                    cursor: pointer;
                    border: 2px solid #0EA5E9;
                    background: transparent;
                    color: #0EA5E9;
                    transition: all 0.3s ease;
                }
                .view-tab.active {
                    background: #0EA5E9;
                    color: white;
                }
                .track-overlay {
                    position: absolute;
                    bottom: 30px;
                    left: 30px; /* Moved to bottom left as requested */
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    min-width: 400px;
                    border: 1px solid #f0f0f0;
                    overflow: hidden;
                }
                .track-overlay-content {
                    padding: 20px 30px;
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }
                .track-stat {
                    display: flex;
                    flex-direction: column;
                }
                .track-stat-value {
                    font-size: 26px;
                    font-weight: 900;
                    color: #1c1c1c;
                }
                .track-stat-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 2px;
                }
                .track-divider {
                    width: 1px;
                    height: 50px;
                    background: #eee;
                }
                .track-bar-container {
                    width: 100%;
                    height: 6px;
                    background: #f0f0f0;
                }
                .track-bar-fill {
                    height: 100%;
                    background: #87ceeb; /* Match Teal route color */
                    transition: width 0.3s linear;
                }
                .destiny-address {
                    padding: 12px 20px;
                    font-size: 13px;
                    color: #444;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #fcfcfc;
                    border-top: 1px solid #f0f0f0;
                }
                /* Admin panel styles */
                .admin-multi-panel {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    z-index: 1100;
                    width: 270px;
                    background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(14, 165, 233, 0.3);
                    border-radius: 16px;
                    box-shadow: 0 12px 36px rgba(0,0,0,0.35);
                    backdrop-filter: blur(18px);
                    overflow: hidden;
                    font-family: 'Outfit', sans-serif;
                    transition: width 0.3s ease, max-height 0.3s ease;
                }
                .admin-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    background: rgba(14, 165, 233, 0.12);
                    border-bottom: 1px solid rgba(14, 165, 233, 0.2);
                    cursor: pointer;
                    user-select: none;
                }
                .admin-panel-title {
                    font-size: 12px;
                    font-weight: 800;
                    color: #7dd3fc;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .admin-panel-toggle {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 700;
                }
                .admin-panel-body {
                    max-height: 380px;
                    overflow-y: auto;
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .admin-panel-body::-webkit-scrollbar { width: 4px; }
                .admin-panel-body::-webkit-scrollbar-track { background: transparent; }
                .admin-panel-body::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.3); border-radius: 4px; }
                .bike-mini-card {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    padding: 10px 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .bike-mini-card:hover {
                    background: rgba(14, 165, 233, 0.12);
                    border-color: rgba(14, 165, 233, 0.35);
                }
                .bike-mini-card.selected {
                    background: rgba(14, 165, 233, 0.18);
                    border-color: #0EA5E9;
                }
                .mini-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .mini-bike-name {
                    font-size: 12px;
                    font-weight: 800;
                    color: #f1f5f9;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 130px;
                }
                .mini-progress-pct {
                    font-size: 11px;
                    font-weight: 800;
                    color: #0EA5E9;
                }
                .mini-customer {
                    font-size: 10px;
                    color: #94a3b8;
                    margin-bottom: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .mini-progress-bar {
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }
                .mini-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0EA5E9, #38bdf8);
                    border-radius: 2px;
                    transition: width 0.5s linear;
                }
                .mini-route {
                    font-size: 9px;
                    color: #64748b;
                    margin-top: 5px;
                }
                `}
            </style>

            <div className="page-header" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h1 className="page-title" style={{ color: '#1c1c1c', fontWeight: '800' }}>Live Map & Tracking</h1>
                    <p className="page-subtitle" style={{ color: '#0EA5E9', fontWeight: '600' }}>
                        {viewMode === 'global' ? '📍 Active Hubs across Andhra Pradesh' : (activeBooking ? `🚲 Tracking Order #${activeBooking.booking_id || 'ACTIVE'}` : '🎯 Track User')}
                    </p>
                </div>

                <div className="view-tabs">
                    {/* Admin: see ALL bookings */}
                    {user?.email === 'admin@3535.com' && allActiveBookings.length > 0 && (
                        <div style={{ marginRight: '20px' }}>
                            <select
                                className="view-tab"
                                style={{ background: '#fff', color: '#0EA5E9', border: '2px solid #0EA5E9' }}
                                onChange={(e) => {
                                    const selected = allActiveBookings.find(b => b.id === e.target.value);
                                    if (selected) { setActiveBooking(selected); setViewMode('track'); }
                                }}
                                value={activeBooking?.id || ''}
                            >
                                <option value="" disabled>📡 Track Booking...</option>
                                {allActiveBookings.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.customerName || b.email} — {b.bikeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Regular user: see only THEIR bookings */}
                    {user?.email !== 'admin@3535.com' && userBookings.length > 1 && (
                        <div style={{ marginRight: '20px' }}>
                            <select
                                className="view-tab"
                                style={{ background: '#fff0f0', color: '#0EA5E9', border: '2px solid #0EA5E9' }}
                                onChange={(e) => {
                                    const selected = userBookings.find(b => b.id === e.target.value);
                                    if (selected) { setActiveBooking(selected); setViewMode('track'); }
                                }}
                                value={activeBooking?.id || ''}
                            >
                                <option value="" disabled>🏍️ Select Your Bike...</option>
                                {userBookings.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.bikeName || 'Bike'} — #{b.booking_id || b.id?.slice(0, 6)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        className={`view-tab ${viewMode === 'global' ? 'active' : ''}`}
                        onClick={() => setViewMode('global')}
                    >
                        🌍 Global Fleet
                    </button>
                    <button
                        className={`view-tab ${viewMode === 'track' ? 'active' : ''}`}
                        onClick={() => setViewMode('track')}
                    >
                        🎯 Track User
                    </button>
                </div>
            </div >

            <div className="tracking-map-wrapper" style={{ flex: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '6px solid #fff0f0', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)' }}>
                {viewMode === 'global' && (
                    <MapContainer center={globalCenter} zoom={7} maxZoom={22} style={{ height: '100%', width: '100%', background: '#edeae6' }}>
                        <TileLayer maxZoom={22} maxNativeZoom={20} url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                        {cityLandmarks.map((city) => (
                            <Marker key={city.id} position={[city.lat, city.lng]} icon={createLandmarkIcon(city.image)}>
                                <Popup>
                                    <div className="tracking-popup">
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{city.name}</h3>
                                        <p style={{ margin: '0', fontSize: '14px', color: '#333' }}>
                                            <strong>Status:</strong>
                                            <span style={{ color: '#87ceeb', fontWeight: '800', marginLeft: '5px', textTransform: 'uppercase' }}>{city.status}</span>
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Admin: render each booking's bike at its current position */}
                        {user?.email === 'admin@3535.com' && allActiveBookings.map(b => {
                            const bProg = multiProgress[b.id] ?? 0;
                            const bStart = cityLandmarks.find(c => c.name.toLowerCase() === (b.startLocation || 'kurnool').toLowerCase()) || cityLandmarks[0];
                            const bDest = cityLandmarks.find(c => c.name.toLowerCase() === (b.location || 'nandyal').toLowerCase()) || cityLandmarks[1];
                            const bLat = bStart.lat + (bDest.lat - bStart.lat) * (bProg / 100);
                            const bLng = bStart.lng + (bDest.lng - bStart.lng) * (bProg / 100);
                            return (
                                <Marker key={`bike-${b.id}`} position={[bLat, bLng]} icon={createBikeIcon()}>
                                    <Popup>
                                        <div style={{ fontFamily: 'Outfit, sans-serif', minWidth: '160px' }}>
                                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#0EA5E9', marginBottom: '4px' }}>🏍️ {b.bikeName || 'Bike'}</div>
                                            <div style={{ fontSize: '12px', color: '#555' }}>👤 {b.customerName || b.email}</div>
                                            <div style={{ fontSize: '12px', color: '#888', margin: '4px 0' }}>{bStart.name} → {bDest.name}</div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>{bProg.toFixed(1)}% complete</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}                {viewMode === 'track' && activeBooking && (
                    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                        <MapContainer center={trackCenter} zoom={7} maxZoom={22} style={{ height: '100%', width: '100%', background: '#edeae6' }}>
                            <TileLayer maxZoom={22} maxNativeZoom={20} url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                            <MapViewHandler center={trackCenter} routeId={routeId} />
                            <Polyline positions={routePoints} color="#87ceeb" weight={5} opacity={0.9} />
                            <Marker position={routePoints[0]} icon={createStartIcon()} />
                            <Marker position={routePoints[routePoints.length - 1]} icon={createDestIcon()} />
                            <Marker position={currentPosition} icon={createBikeIcon()} />
                        </MapContainer>
                    </div>
                )}
                {viewMode === 'track' && !activeBooking && !loadingBooking && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', color: '#666', backgroundColor: '#f9f9f9' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🗺️</div>
                        <h2 style={{ color: '#1c1c1c', fontWeight: '800' }}>No Active Discoveries</h2>
                        <p style={{ fontSize: '16px' }}>Please complete a bike booking to view your real-time tracking route.</p>
                    </div>
                )}
            </div >


        </div >
    );
};

export default LiveTracking;

