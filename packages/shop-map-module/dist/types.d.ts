export interface Shop {
    id: number;
    name: string;
    address: string;
    url?: string;
    description?: string;
    lat?: number;
    lng?: number;
    distance?: number;
    type: 'shop';
    isOnline?: boolean;
    segmentDistance?: number;
    category?: string;
}
export interface Castle {
    id: number;
    name: string;
    lat: number;
    lng: number;
    distance?: number;
    type: 'castle';
    segmentDistance?: number;
}
export type Location = Shop | Castle;
export type LatLngLiteral = {
    lat: number;
    lng: number;
};
export type TripType = 'outbound' | 'inbound';
export interface TripData {
    segments: Array<{
        start: LatLngLiteral;
        end: LatLngLiteral;
        distance: number;
    }>;
    totalDistance: number;
    title: string;
}
