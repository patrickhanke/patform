export type MapPlace = google.maps.places.PlaceResult

export type MapProps = {
    initialPlace?: MapPlace | null;
    onChange: (map: google.maps.places.PlaceResult | null) => void;
    height?: number;
};

export type LatLng = {
    lat: number;
    lng: number;
}