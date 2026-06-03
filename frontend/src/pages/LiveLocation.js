import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

/* ─── Icons ─── */
const createBikeIcon = (rotation = 0) =>
    L.divIcon({
        className: 'll-bike-icon',
        html: `
          <div style="position:relative;width:54px;height:54px;display:flex;align-items:center;justify-content:center;transform:rotate(${rotation}deg);transition:transform 0.3s ease;">
            <div style="position:absolute;width:100%;height:100%;border-radius:50%;border:3px solid #87CEEB;animation:llpulse 1.4s ease-out infinite;opacity:0;"></div>
            <div style="width:38px;height:38px;background:#87CEEB;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(135,206,235,0.45);border:2px solid #fff;">
              <span style="font-size:20px;line-height:1;transform:scaleX(-1);">🏍️</span>
            </div>
          </div>`,
        iconSize: [54, 54],
        iconAnchor: [27, 27],
    });

const createStartIcon = () =>
    L.divIcon({
        className: 'll-start-icon',
        html: `<div style="font-size:32px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🟢</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    });

const createDestIcon = () =>
    L.divIcon({
        className: 'll-dest-icon',
        html: `<div style="font-size:32px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2));">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    });

/* ─── City coordinates ─── */
const cityCoords = {
    kurnool: { lat: 15.8281, lng: 78.0373 },
    nandyal: { lat: 15.4800, lng: 78.4833 },
    kadapa: { lat: 14.4673, lng: 78.8242 },
    vijayawada: { lat: 16.5062, lng: 80.6480 },
    vizag: { lat: 17.6868, lng: 83.2185 },
    visakhapatnam: { lat: 17.6868, lng: 83.2185 },
    guntur: { lat: 16.3067, lng: 80.4365 },
    tirupati: { lat: 13.6288, lng: 79.4192 },
    nellore: { lat: 14.4426, lng: 79.9865 },
    rajamundry: { lat: 16.9891, lng: 81.7836 },
    kakinada: { lat: 16.9322, lng: 82.2381 },
    ananthapur: { lat: 14.6819, lng: 77.6006 },
    ongole: { lat: 15.5057, lng: 80.0499 },
};

/* ─── Speed & Distance ─── */
const routeInfo = {
    nandyal: { distance: 78, speed: 45 },
    kadapa: { distance: 180, speed: 70 },
    vijayawada: { distance: 349, speed: 95 },
    vizag: { distance: 704, speed: 135 },
    visakhapatnam: { distance: 704, speed: 135 },
    guntur: { distance: 430, speed: 50 },
    tirupati: { distance: 551, speed: 75 },
    nellore: { distance: 809, speed: 125 },
    rajamundry: { distance: 312, speed: 100 },
    kakinada: { distance: 720, speed: 125 },
    ananthapur: { distance: 445, speed: 90 },
    ongole: { distance: 1000, speed: 100 },
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateBearing = (start, end) => {
    const startLat = (start[0] * Math.PI) / 180;
    const startLng = (start[1] * Math.PI) / 180;
    const endLat = (end[0] * Math.PI) / 180;
    const endLng = (end[1] * Math.PI) / 180;
    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
};

/* Smooth curved route */
const buildCurvedRoute = (start, end, steps = 100) => {
    const points = [];
    const midLat = (start[0] + end[0]) / 2;
    const midLng = (start[1] + end[1]) / 2;
    const offsetLat = (end[1] - start[1]) * 0.1;
    const offsetLng = -(end[0] - start[0]) * 0.1;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        points.push([
            (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * (midLat + offsetLat) + t ** 2 * end[0],
            (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * (midLng + offsetLng) + t ** 2 * end[1],
        ]);
    }
    return points;
};

/* Auto-fit map to route */
const FitBounds = ({ bounds, routeId }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length >= 2) {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
        }
    }, [routeId, map]); // Only trigger when the route actually changes, not every progress tick
    return null;
};

/* Compute route data from a booking + progress % */
const computeRoute = (booking, pct) => {
    if (!booking) return null;
    const startName = booking.startLocation || 'Kurnool';
    const destName = booking.location || 'Nandyal';
    const sc = cityCoords[startName.toLowerCase()] || cityCoords.kurnool;
    const dc = cityCoords[destName.toLowerCase()] || cityCoords.nandyal;
    const startCoord = [sc.lat, sc.lng];
    const destCoord = [dc.lat, dc.lng];
    const destKey = destName.toLowerCase();
    let totalDist, speed;
    if (startName.toLowerCase() === 'kurnool' && routeInfo[destKey]) {
        totalDist = routeInfo[destKey].distance;
        speed = routeInfo[destKey].speed;
    } else {
        totalDist = haversine(sc.lat, sc.lng, dc.lat, dc.lng);
        speed = totalDist > 300 ? 95 : totalDist > 100 ? 70 : 50;
    }
    const fullRoute = buildCurvedRoute(startCoord, destCoord, 100);
    const split = Math.round((pct / 100) * (fullRoute.length - 1));
    const curPos = fullRoute[split] || startCoord;
    
    // Calculate rotation
    let rotation = 0;
    if (split < fullRoute.length - 1) {
        rotation = calculateBearing(fullRoute[split], fullRoute[split + 1]);
    } else if (split > 0) {
        rotation = calculateBearing(fullRoute[split - 1], fullRoute[split]);
    }

    const distRemaining = Math.max(0, totalDist * (1 - pct / 100));
    const etaMins = Math.floor((distRemaining / speed) * 60);
    
    return {
        startName, destName, startCoord, destCoord,
        currentPos: curPos, rotation,
        totalDist: Math.round(totalDist), speed, distRemaining: distRemaining.toFixed(1),
        etaMins, pct, splitIndex: split, fullRoute,
        traveled: fullRoute.slice(0, split + 1),
        remaining: fullRoute.slice(split),
        bounds: [startCoord, destCoord],
        routeId: `${startName}-${destName}`
    };
};

/* ═══════════════════════════════════════════════
   LIVE LOCATION — Admin Single-Booking Tracker
   ═══════════════════════════════════════════════ */
const LiveLocation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin' || user?.email === 'admin@123.com';
    const [bookings, setBookings] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [notified, setNotified] = useState({});
    const [showArrivalPopup, setShowArrivalPopup] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetch_data = async () => {
            try {
                const tok = await user.getIdToken();
                const res = await fetch(`${API_BASE_URL}/api/bookings`, {
                    headers: { Authorization: `Bearer ${tok}` },
                });
                if (res.ok) {
                    const json = await res.json();
                    const active = (json.data || []).filter(b => {
                        const s = (b.status || '').toLowerCase();
                        const isNotClosed = s !== 'delivered' && s !== 'cancelled';
                        const createdDate = new Date(b.created_at || b.createdAt || 0).getTime();
                        const isRecent = (Date.now() - createdDate) <= 3 * 24 * 60 * 60 * 1000; // 3 days
                        const isMine = isAdmin || b.email === user.email;
                        return isNotClosed && isRecent && isMine;
                    });
                    active.sort((a, b) =>
                        new Date(b.created_at || 0) - new Date(a.created_at || 0)
                    );
                    if (active.length === 0) {
                        // Demo Mode: Inject multiple mock active bookings if none exist
                        active.push(
                            { id: 'DEMO-001', bikeName: 'S1000RR Phantom', customerName: 'Rider Alpha', startLocation: 'Kurnool', location: 'Nellore', status: 'in-transit', created_at: new Date(Date.now() - 3600000).toISOString() },
                            { id: 'DEMO-002', bikeName: 'GT-650 Chrome', customerName: 'Rider Beta', startLocation: 'Kurnool', location: 'Vijayawada', status: 'in-transit', created_at: new Date(Date.now() - 7200000).toISOString() },
                            { id: 'DEMO-003', bikeName: 'Himalayan 450', customerName: 'Rider Gamma', startLocation: 'Kurnool', location: 'Kadapa', status: 'in-transit', created_at: new Date(Date.now() - 1800000).toISOString() },
                            { id: 'DEMO-004', bikeName: 'ZX-10R Ninja', customerName: 'Rider Delta', startLocation: 'Kurnool', location: 'Vizag', status: 'in-transit', created_at: new Date(Date.now() - 10800000).toISOString() },
                            { id: 'DEMO-005', bikeName: 'RC 390 GP', customerName: 'Rider Epsilon', startLocation: 'Kurnool', location: 'Guntur', status: 'in-transit', created_at: new Date(Date.now() - 5400000).toISOString() }
                        );
                    }
                    setBookings(active);
                    if (active.length > 0) setSelectedId(active[0].id);
                }
            } catch (e) {
                console.error('LiveLocation error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetch_data();
    }, [user, isAdmin, navigate]);

    /* Update progress for ALL active bookings */
    useEffect(() => {
        if (loading || bookings.length === 0) return;

        // Initialize progress for all if not already set
        setProgress(prev => {
            const next = { ...prev };
            let hasNew = false;
            bookings.forEach(b => {
                if (next[b.id] === undefined) {
                    const createdTime = new Date(b.created_at || b.createdAt || Date.now()).getTime();
                    const destKey = (b.location || '').toLowerCase();
                    const info = routeInfo[destKey];
                    const speed = info ? info.speed : 65;
                    const dist = info ? info.distance : 150;

                    const totalDurationMs = (dist / speed) * 3600 * 1000 / 60; // 60x simulation
                    const elapsedMs = Date.now() - createdTime;
                    const initialPct = Math.min(Math.max((elapsedMs / totalDurationMs) * 100, 0), 100);
                    next[b.id] = initialPct;
                    hasNew = true;
                }
            });
            return hasNew ? next : prev;
        });

        const iv = setInterval(() => {
            setProgress(prev => {
                const next = { ...prev };
                let changed = false;
                bookings.forEach(b => {
                    const cur = next[b.id] ?? 0;
                    if (cur >= 100) {
                        if (!notified[b.id]) {
                            setNotified(n => ({...n, [b.id]: true}));
                            setShowArrivalPopup(b.id);
                            setTimeout(() => setShowArrivalPopup(null), 8000);
                        }
                        return;
                    }
                    const destKey = (b.location || '').toLowerCase();
                    const info = routeInfo[destKey];
                    const speed = info ? info.speed : 65;
                    const dist = info ? info.distance : 150;
                    const step = ((speed / dist) * (100 / 3600)) * 60 * 0.05; // 50ms interval
                    next[b.id] = Math.min(cur + step, 100);
                    changed = true;
                });
                return changed ? next : prev;
            });
        }, 50);
        return () => clearInterval(iv);
    }, [bookings, loading, notified]);

    // if (!isAdmin) return null; // Removed to allow users

    const selectedBooking = bookings.find(b => b.id === selectedId) || null;
    const pct = progress[selectedId] ?? 0;
    const route = computeRoute(selectedBooking, pct);
    const arrivedBooking = bookings.find(b => b.id === showArrivalPopup);
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB', fontFamily: 'Outfit,sans-serif' }}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
                <div style={{ width: 44, height: 44, border: '3px solid rgba(135,206,235,0.1)', borderTopColor: '#87CEEB', borderRadius: '50%', animation: 'llspin 0.9s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ fontWeight: 700 }}>{isAdmin ? 'Accessing Secure Fleet Data...' : 'Initializing Live Stream...'}</p>
            </div>
            <style>{`@keyframes llspin{to{transform:rotate(360deg)}} @keyframes llpulse{0%{transform:scale(0.5);opacity:1}100%{transform:scale(2);opacity:0}}`}</style>
        </div>
    );

    return (
        <div className="live-location-page" style={{ height: 'calc(100vh - 80px)', width: '100%', position: 'relative', overflow: 'hidden', background: '#F9FAFB', display: 'flex' }}>
            <style>{`
                @keyframes llpulse{0%{transform:scale(0.5);opacity:1}100%{transform:scale(2);opacity:0}}
                @keyframes llspin{to{transform:rotate(360deg)}}
                @keyframes llblink{0%,100%{opacity:1}50%{opacity:0.4}}
                .ll-bike-icon,.ll-start-icon,.ll-dest-icon{background:transparent;border:none;}
                .leaflet-control-attribution{display:none!important;}
                .ll-card{
                    background: rgba(14, 165, 233, 0.05);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(14, 165, 233, 0.1);
                    border-radius: 16px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    margin-bottom: 10px;
                }
                .ll-card:hover{ background: rgba(14, 165, 233, 0.1); transform: translateY(-2px); box-shadow: 0 10px 25px rgba(14, 165, 233, 0.05); }
                .ll-card.active{ background: #ffffff; border-color: #0EA5E9; box-shadow: 0 0 20px rgba(14, 165, 233, 0.2); }
                .ll-card-bar{ height: 5px; background: rgba(0,0,0,0.04); border-radius: 10px; overflow: hidden; margin-top: 12px; }
                .ll-card-fill{ height: 100%; border-radius: 10px; transition: width 0.3s ease; }
                .ll-panel-body::-webkit-scrollbar{ width: 5px; }
                .ll-panel-body::-webkit-scrollbar-thumb{ background: rgba(0,0,0,0.05); border-radius: 10px; }
                .ll-glass-panel { background: rgba(14, 165, 233, 0.08); backdrop-filter: blur(30px); border-right: 1px solid rgba(14, 165, 233, 0.1); }
                .leaflet-container { font-family: 'Outfit', sans-serif !important; }
            `}</style>

            {/* ═══ LEFT PANEL (GLOSSY BRIGHT) ═══ */}
            <div className="ll-glass-panel" style={{
                width: 350,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 10,
            }}>
                <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#87CEEB', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {isAdmin ? '📡 Fleet Operations' : '🎯 Live Tracking'}
                        </span>
                        <span style={{
                            background: 'rgba(135,206,235,0.1)',
                            color: '#87CEEB',
                            fontSize: 11, fontWeight: 800,
                            padding: '4px 12px', borderRadius: 100,
                        }}>
                            {bookings.length} {isAdmin ? 'Active' : 'Units'}
                        </span>
                    </div>
                </div>

                <div className="ll-panel-body" style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                    {bookings.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                            <div style={{ fontSize: 48, marginBottom: 15 }}>🛸</div>
                            <p style={{ fontWeight: 700, fontSize: 14 }}>Waiting for new data...</p>
                        </div>
                    )}

                    {bookings.map(b => {
                        const p = progress[b.id] ?? 0;
                        const isActive = b.id === selectedId;
                        const arrived = p >= 100;
                        return (
                            <div
                                key={b.id}
                                className={`ll-card ${isActive ? 'active' : ''}`}
                                onClick={() => setSelectedId(b.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: isActive ? '#87CEEB' : '#e2e8f0', boxShadow: isActive ? '0 0 8px #87CEEB' : 'none', animation: isActive ? 'llblink 1.5s infinite' : 'none' }} />
                                        <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>🏍️ {b.bikeName}</span>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: arrived ? '#00C853' : '#87CEEB' }}>
                                        {arrived ? 'ARRIVED ✓' : `${p.toFixed(1)}%`}
                                    </span>
                                </div>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginLeft: 20 }}>
                                    {b.customerName || b.email}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', marginLeft: 20, marginTop: 4 }}>
                                    {b.startLocation || 'Kurnool'} → {b.location}
                                </div>
                                <div className="ll-card-bar">
                                    <div className="ll-card-fill" style={{ width: `${p}%`, background: arrived ? '#00C853' : '#87CEEB' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══ REALISTIC MAP AREA ═══ */}
            <div style={{ flex: 1, position: 'relative' }}>
                {showArrivalPopup && arrivedBooking && (
                    <div style={{
                        position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                        background: '#ffffff', color: '#1a1a2e', padding: '20px 30px', borderRadius: '24px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px',
                        border: '1px solid rgba(0,0,0,0.05)', animation: 'dropIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <style>{`@keyframes dropIn { from { opacity: 0; transform: translate(-50%, -30px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
                        <div style={{ fontSize: 32 }}>🏆</div>
                        <div>
                            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#87CEEB' }}>MISSION COMPLETE</div>
                            <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.9rem' }}>{arrivedBooking.bikeName} has reached {arrivedBooking.location} safely!</div>
                        </div>
                    </div>
                )}

                {route ? (
                    <>
                        <MapContainer
                            center={route.currentPos}
                            zoom={9}
                            style={{ height: '100%', width: '100%', background: '#F9FAFB' }}
                            zoomControl={false}
                        >
                            {/* High Quality Bright Google-Style Tiles */}
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                            <FitBounds bounds={route.bounds} routeId={route.routeId} />

                            {/* Ultra Thick Solid Path */}
                            <Polyline positions={route.fullRoute} color="#e2e8f0" weight={10} opacity={0.6} />
                            {route.traveled.length > 1 && (
                                <Polyline positions={route.traveled} color="#87CEEB" weight={10} opacity={1} lineCap="round" lineJoin="round" />
                            )}

                            <Marker position={route.startCoord} icon={createStartIcon()} />
                            <Marker position={route.destCoord} icon={createDestIcon()} />
                            <Marker position={route.currentPos} icon={createBikeIcon(route.rotation)}>
                                <Popup>
                                    <div style={{ padding: '5px', textAlign: 'center' }}>
                                        <b style={{ color: '#87CEEB' }}>{selectedBooking.bikeName}</b><br/>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>Speed: {route.speed} km/h</span>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>

                        {/* Status Pill */}
                        <div style={{
                            position: 'absolute', top: 25, right: 25, zimage: 1000,
                            background: 'rgba(14, 165, 233, 0.1)', backdropFilter: 'blur(15px)',
                            padding: '12px 24px', borderRadius: '50px',
                            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)',
                            display: 'flex', alignItems: 'center', gap: 12
                        }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: pct >= 100 ? '#00C853' : '#87CEEB', animation: 'llblink 1s infinite' }} />
                            <span style={{ fontSize: 13, fontWeight: 900, color: '#1a1a2e', letterSpacing: '0.05em' }}>
                                {pct >= 100 ? 'STATUS: DELIVERED' : 'STATUS: IN TRANSIT'}
                            </span>
                        </div>

                        {/* HUD (BRIGHT GLASS) */}
                        <div style={{
                            position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
                            zIndex: 1000, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(35px)',
                            border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '30px',
                            minWidth: 600, padding: '25px', boxShadow: '0 30px 60px rgba(14, 165, 233, 0.1)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
                                {[
                                    { label: 'ETA', val: route.etaMins, unit: 'm', color: '#87CEEB' },
                                    { label: 'REMAINING', val: route.distRemaining, unit: 'km', color: '#1a1a2e' },
                                    { label: 'SPEED', val: route.speed, unit: 'km/h', color: '#1a1a2e' },
                                    { label: 'PROGRESS', val: pct.toFixed(0), unit: '%', color: '#87CEEB' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}<span style={{ fontSize: 13, opacity: 0.6 }}>{s.unit}</span></div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 6, background: 'rgba(0,0,0,0.04)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #87CEEB, #FF8C42)', borderRadius: '10px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛣️</div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8' }}>ROUTE TRACK</div>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e' }}>{route.startName} → {route.destName}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1a1a2e' }}>{selectedBooking.customerName || 'Premium Client'}</div>
                                    <div style={{ fontSize: 10, color: '#87CEEB', fontWeight: 900 }}>REF: #{selectedBooking.id?.slice(0, 8).toUpperCase()}</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <div style={{ fontSize: 80, marginBottom: 20 }}>🛰️</div>
                        <h2 style={{ color: '#1a1a2e', fontWeight: 900 }}>Select Active Carrier</h2>
                        <p style={{ maxWidth: 300, textAlign: 'center', fontSize: 14 }}>Please select a booking from the operations panel to initialize the live GPS stream.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveLocation;
