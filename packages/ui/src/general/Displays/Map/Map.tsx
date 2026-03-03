"use client";

import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import "./styles.scss";
import { LatLng, MapProps } from "./types";
import { Divider } from "../../Layout";
import { IconButton } from "../../Buttons";
const containerStyle = {
	width: "400px",
	height: "400px"
};

const API_KEY = "AIzaSyAJgX9vOxmGb-w5JtU4z9xrlXJ0vKpQHP8";

const defaultPlace = { lat: 52.51226761820683, lng: 13.379393221148042 };

const MAP_LIBRARIES = ["places"] as ["places"];

const Map = ({ initialPlace = defaultPlace, onChange }: MapProps) => {
	const [selectedPlace, setSelectedPlace] = useState<LatLng>(
		initialPlace || defaultPlace
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: API_KEY,
		libraries: MAP_LIBRARIES
	});

	const [map, setMap] = useState<google.maps.Map | null>(null);

	const onLoad = useCallback(
		function callback(map: google.maps.Map) {
			map.setCenter(selectedPlace);
			map.setZoom(10);
			setMap(map);
		},
		[selectedPlace]
	);

	const onUnmount = useCallback(function callback() {
		setMap(null);
	}, []);

	const handleSearch = async () => {
		if (!map || !searchQuery) return;
		setLoading(true);
		const request = {
			query: searchQuery,
			fields: ["geometry"]
		};

		const placesService = new window.google.maps.places.PlacesService(map);
		const results: google.maps.places.PlaceResult[] = await new Promise(
			(resolve, reject) => {
				placesService.findPlaceFromQuery(request, (results, status) => {
					if (
						status ===
							window.google.maps.places.PlacesServiceStatus.OK &&
						results
					) {
						resolve(results);
					} else {
						reject(status);
					}
				});
			}
		);

		if (results && results[0]?.geometry?.location) {
			const location = results[0].geometry.location;
			const newPlace: LatLng = {
				lat: location.lat(),
				lng: location.lng()
			};
			setSelectedPlace(newPlace);
			map.panTo(newPlace);

			if (onChange) onChange(newPlace);
		}
		setLoading(false);
	};

	return isLoaded ? (
		<div>
			<div className="flex row a-ce j-sb w-100">
				<input
					type="text"
					placeholder="Search for a place"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<IconButton
					icon="search"
					text="Nach Ort suchen"
					onClick={handleSearch}
					disabled={loading || !searchQuery}
					loading={loading}
				/>
			</div>
			<Divider />
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={selectedPlace}
				zoom={10}
				onLoad={onLoad}
				onUnmount={onUnmount}
			>
				{/* Add markers based on latitude and longitude */}
				{selectedPlace && (
					<Marker
						position={{
							lat: selectedPlace.lat,
							lng: selectedPlace.lng
						}}
					/>
				)}
			</GoogleMap>
		</div>
	) : (
		<></>
	);
};

export default Map;
