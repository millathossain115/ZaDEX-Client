import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import districtsData from '../../../data/districtsData';

// Fix default marker icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon based on number of service centers
const createCustomIcon = (centers, isHighlighted = false) => {
    const size = Math.max(28, Math.min(48, 20 + centers * 2));
    const bgColor = isHighlighted ? '#f97316' : '#03373D';
    const borderColor = isHighlighted ? '#ea580c' : '#025a63';
    const pulseClass = isHighlighted ? 'marker-pulse' : '';

    return L.divIcon({
        html: `
            <div class="custom-marker ${pulseClass}" style="
                background: ${bgColor};
                border: 2.5px solid ${borderColor};
                color: white;
                border-radius: 50%;
                width: ${size}px;
                height: ${size}px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${size > 36 ? 13 : 11}px;
                font-weight: 700;
                box-shadow: 0 3px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            ">${centers}</div>
        `,
        className: 'custom-div-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
};

// Small pin icon for individual service center locations
const centerPinIcon = L.divIcon({
    html: `
        <div style="
            position: relative;
            width: 24px;
            height: 32px;
        ">
            <svg viewBox="0 0 24 32" width="24" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
                <circle cx="12" cy="11" r="4.5" fill="white"/>
            </svg>
        </div>
    `,
    className: 'center-pin-icon',
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
});

// Generate deterministic service center positions around a district
// Uses a simple seeded pseudo-random so positions are consistent
const generateCenterPositions = (district) => {
    const positions = [];
    const spread = 0.04; // ~4km spread around district center
    // Simple seed from district name
    let seed = 0;
    for (let i = 0; i < district.name.length; i++) {
        seed += district.name.charCodeAt(i);
    }
    const seededRandom = (s) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < district.centers; i++) {
        const latOffset = (seededRandom(seed + i * 7) - 0.5) * spread * 2;
        const lngOffset = (seededRandom(seed + i * 13 + 3) - 0.5) * spread * 2;
        positions.push({
            lat: district.lat + latOffset,
            lng: district.lng + lngOffset,
            name: `${district.name} Center #${i + 1}`,
        });
    }
    return positions;
};

// Component to control map view changes
const MapController = ({ center, zoom }) => {
    const map = useMap();
    React.useEffect(() => {
        if (center && zoom) {
            map.flyTo(center, zoom, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

const Coverage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDistrict, setActiveDistrict] = useState(null);
    const [mapCenter, setMapCenter] = useState([23.685, 90.3563]); // center of Bangladesh
    const [mapZoom, setMapZoom] = useState(7);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    // Total service centers
    const totalCenters = useMemo(() => districtsData.reduce((sum, d) => sum + d.centers, 0), []);

    // Handle search input change with suggestions
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim().length > 0) {
            const filtered = districtsData.filter(d =>
                d.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            // Reset map
            setActiveDistrict(null);
            setMapCenter([23.685, 90.3563]);
            setMapZoom(7);
        }
    };

    // Handle search submit
    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setActiveDistrict(null);
            setMapCenter([23.685, 90.3563]);
            setMapZoom(7);
            return;
        }

        const found = districtsData.find(d =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (found) {
            selectDistrict(found);
        }
    };

    // Select a district
    const selectDistrict = (district) => {
        setActiveDistrict(district);
        setSearchQuery(district.name);
        setMapCenter([district.lat, district.lng]);
        setMapZoom(11);
        setShowSuggestions(false);
    };

    // Handle enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            setShowSuggestions(false);
        }
    };

    // Reset search
    const handleReset = () => {
        setSearchQuery('');
        setActiveDistrict(null);
        setMapCenter([23.685, 90.3563]);
        setMapZoom(7);
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    return (
        <div className="bg-[#F0F0F0] min-h-screen">
            {/* Header Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Our <span className="text-[#03373D]">Coverage</span> Area
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Zadex delivers across <span className="font-bold text-[#03373D]">64 districts</span> of Bangladesh 
                        with <span className="font-bold text-[#03373D]">{totalCenters} service centers</span>. 
                        Search for your district to find nearby service points.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-xl mx-auto relative">
                    <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#03373D]/30 focus-within:border-[#03373D] transition-all duration-200">
                        {/* Search Icon */}
                        <div className="pl-5 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => searchQuery && setSuggestions(
                                districtsData.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            )}
                            placeholder="Search any district... (e.g. Dhaka, Chattogram)"
                            className="flex-1 px-4 py-4 text-gray-800 placeholder-gray-400 text-sm focus:outline-none bg-transparent"
                        />
                        {/* Clear Button */}
                        {searchQuery && (
                            <button
                                onClick={handleReset}
                                className="p-2 mr-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-[#03373D] hover:bg-[#025a63] text-white px-6 py-4 font-semibold text-sm transition-all duration-200 cursor-pointer"
                        >
                            Search
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[1000] max-h-64 overflow-y-auto">
                            {suggestions.map((district, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectDistrict(district)}
                                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#E6F7F8] transition-colors cursor-pointer text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <span className="text-sm font-semibold text-gray-800">{district.name}</span>
                                            <span className="text-xs text-gray-400 ml-2">{district.division} Division</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#03373D] bg-[#E6F7F8] px-2.5 py-1 rounded-full">
                                        {district.centers} {district.centers === 1 ? 'center' : 'centers'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No results message */}
                    {showSuggestions && searchQuery && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[1000]">
                            <div className="px-5 py-4 text-center text-gray-500 text-sm">
                                No districts found for "<span className="font-semibold">{searchQuery}</span>"
                            </div>
                        </div>
                    )}
                </div>

                {/* Active District Info Card */}
                {activeDistrict && (
                    <div className="max-w-xl mx-auto mt-4">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#03373D] rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{activeDistrict.name}</h3>
                                    <p className="text-sm text-gray-500">{activeDistrict.division} Division</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-extrabold text-[#03373D]">{activeDistrict.centers}</p>
                                <p className="text-xs text-gray-500 font-medium">Service {activeDistrict.centers === 1 ? 'Center' : 'Centers'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200" style={{ height: '600px' }}>
                    <MapContainer
                        center={[23.685, 90.3563]}
                        zoom={7}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapController center={mapCenter} zoom={mapZoom} />

                        {districtsData.map((district, idx) => {
                            const isActive = activeDistrict?.name === district.name;
                            return (
                                <Marker
                                    key={idx}
                                    position={[district.lat, district.lng]}
                                    icon={createCustomIcon(district.centers, isActive)}
                                    eventHandlers={{
                                        click: () => selectDistrict(district),
                                    }}
                                >
                                    <Popup>
                                        <div className="text-center p-1">
                                            <h3 className="font-bold text-base text-gray-900 mb-1">{district.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{district.division} Division</p>
                                            <div className="bg-[#E6F7F8] rounded-lg px-3 py-2">
                                                <span className="text-xl font-extrabold text-[#03373D]">{district.centers}</span>
                                                <p className="text-xs text-[#03373D] font-medium">Service {district.centers === 1 ? 'Center' : 'Centers'}</p>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* Individual service center pin markers for the active district */}
                        {activeDistrict && generateCenterPositions(activeDistrict).map((center, idx) => (
                            <Marker
                                key={`center-${idx}`}
                                position={[center.lat, center.lng]}
                                icon={centerPinIcon}
                            >
                                <Popup>
                                    <div className="text-center p-1">
                                        <h3 className="font-bold text-sm text-gray-900 mb-1">{center.name}</h3>
                                        <p className="text-xs text-gray-500">{activeDistrict.division} Division</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-extrabold text-[#03373D]">64</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Districts Covered</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-extrabold text-[#03373D]">{totalCenters}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Service Centers</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-extrabold text-[#03373D]">8</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Divisions</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100">
                        <p className="text-2xl font-extrabold text-[#03373D]">100%</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Nationwide Coverage</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coverage;