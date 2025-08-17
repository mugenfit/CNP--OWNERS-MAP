'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { useState, useMemo } from 'react';
const ShopMap = ({ shops, userLocation }) => {
    const [selectedShop, setSelectedShop] = useState(null);
    const sortedShops = useMemo(() => {
        if (!userLocation)
            return shops;
        // Filter out shops without distance for sorting
        const shopsWithDistance = shops.filter(shop => shop.distance !== undefined);
        const shopsWithoutDistance = shops.filter(shop => shop.distance === undefined);
        shopsWithDistance.sort((a, b) => (a.distance) - (b.distance));
        return [...shopsWithDistance, ...shopsWithoutDistance];
    }, [shops, userLocation]);
    return (_jsxs("div", { style: { display: 'flex', height: '100%' }, children: [" ", _jsxs("div", { style: { width: '300px', overflowY: 'auto', padding: '10px' }, children: [_jsx("h2", { children: "\u30AA\u30FC\u30CA\u30FC\u30BA\u52A0\u76DF\u5E97" }), _jsx("ul", { children: sortedShops.map(shop => (_jsxs("li", { onClick: () => setSelectedShop(shop), style: { cursor: 'pointer', margin: '10px 0' }, children: [_jsx("strong", { children: shop.name }), _jsx("br", {}), _jsx("small", { children: shop.address }), shop.distance !== undefined && (_jsxs("p", { children: ["\u73FE\u5728\u5730\u304B\u3089\u306E\u8DDD\u96E2: ", shop.distance.toFixed(2), " km"] }))] }, shop.id))) })] }), _jsx("div", { style: { flexGrow: 1 }, children: _jsxs(Map, { mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID, defaultCenter: userLocation || { lat: 35.681236, lng: 139.767125 }, defaultZoom: 10, gestureHandling: 'greedy', disableDefaultUI: false, children: [sortedShops.map((shop) => (!shop.isOnline && shop.lat && shop.lng && (_jsx(AdvancedMarker, { position: { lat: shop.lat, lng: shop.lng }, onClick: () => setSelectedShop(shop), children: _jsx(Pin, { background: '#FFD700', borderColor: '#000000', glyphColor: '#000000' }) }, shop.id)))), selectedShop && selectedShop.lat && selectedShop.lng && (_jsx(InfoWindow, { position: { lat: selectedShop.lat, lng: selectedShop.lng }, onCloseClick: () => setSelectedShop(null), children: _jsxs("div", { children: [_jsx("h3", { children: selectedShop.name }), _jsx("p", { children: selectedShop.address }), selectedShop.description && _jsx("p", { children: selectedShop.description }), selectedShop.url && _jsx("p", { children: _jsx("a", { href: selectedShop.url, target: "_blank", rel: "noopener noreferrer", children: "\u8A73\u7D30\u3092\u898B\u308B" }) }), selectedShop.distance !== undefined && (_jsxs("p", { children: ["\u73FE\u5728\u5730\u304B\u3089\u306E\u8DDD\u96E2: ", selectedShop.distance.toFixed(2), " km"] }))] }) }))] }) })] }));
};
export default ShopMap;
