export type MapPlace = google.maps.places.PlaceResult

export type MapProps = {
    initialPlace: Place;
    onChange: (map: google.maps.places.PlaceResult | null) => void;
    height?: number;
};