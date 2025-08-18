interface Shop {
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
interface Castle {
    id: number;
    name: string;
    lat: number;
    lng: number;
    distance?: number;
    type: 'castle';
    segmentDistance?: number;
}
type Location = Shop | Castle;

declare const useShops: (userLocation: {
    lat: number;
    lng: number;
} | null, isApiLoaded: boolean) => {
    shops: Shop[];
    loading: boolean;
    error: string | null;
};

export { type Castle, type Location, type Shop, useShops };
