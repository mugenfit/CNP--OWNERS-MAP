import { Shop } from './types';
interface ShopMapProps {
    shops: Shop[];
    userLocation: {
        lat: number;
        lng: number;
    } | null;
}
declare const ShopMap: React.FC<ShopMapProps>;
export default ShopMap;
