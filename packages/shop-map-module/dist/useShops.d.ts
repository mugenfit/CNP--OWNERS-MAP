import { Shop } from './types';
export declare const useShops: (userLocation: {
    lat: number;
    lng: number;
} | null) => {
    shops: Shop[];
    loading: boolean;
    error: string | null;
};
