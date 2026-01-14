export type MapProps = {
	initialPlace?: { lat: number; lng: number } | null;
	onChange: (map: LatLng) => void;
	height?: number;
};

export type LatLng = {
	lat: number;
	lng: number;
};

export type LatitudeLongitude = {
	lat: number;
	lng: number;
};
