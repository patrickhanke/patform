"use client";

import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import "./styles.scss";
import { LatLng, MapProps } from "./types";
import { Divider } from "../../Layout";
const containerStyle = {
	width: "400px",
	height: "400px"
};

const API_KEY = "AIzaSyAJgX9vOxmGb-w5JtU4z9xrlXJ0vKpQHP8";

const Map = ({ initialPlace, onChange }: MapProps) => {
	const [selectedPlace, setSelectedPlace] = useState<LatLng>(
		initialPlace || { lat: 0, lng: 0 }
	);
	const [searchQuery, setSearchQuery] = useState("");

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: API_KEY,
		libraries: ["places"]
	});

	const [map, setMap] = useState<google.maps.Map | null>(null);

	const onLoad = useCallback(function callback(map: google.maps.Map) {
		// This is just an example of getting and using the map instance!!! don't just blindly copy!
		const bounds = new window.google.maps.LatLngBounds(selectedPlace);
		map.fitBounds(bounds);

		setMap(map);
	}, []);

	const onUnmount = useCallback(function callback() {
		setMap(null);
	}, []);

	const handleSearch = async () => {
		if (!map || !searchQuery) return;

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
			console.log(newPlace);

			if (onChange) onChange(newPlace);
		}
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
				<button className="full_button sm grey" onClick={handleSearch}>
					Search
				</button>
			</div>
			<Divider />
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={selectedPlace}
				zoom={7}
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
