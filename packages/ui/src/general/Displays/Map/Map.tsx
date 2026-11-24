"use client";

import { useCallback, useId, useState } from "react";
import {
	APIProvider,
	AdvancedMarker,
	Map as GoogleMap,
	useMap,
	useMapsLibrary
} from "@vis.gl/react-google-maps";

import "./styles.scss";
import { LatLng, MapProps } from "./types";
import { Divider } from "../../Layout";
import { IconButton } from "../../Buttons";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
const CLOUD_MAP_ID = "DEMO_MAP_ID";

const defaultPlace: LatLng = {
	lat: 52.51226761820683,
	lng: 13.379393221148042
};

const Map = ({ initialPlace, onChange, height = 400 }: MapProps) => {
	const startPlace = initialPlace || defaultPlace;

	return (
		<APIProvider apiKey={API_KEY}>
			<LocationMap
				startPlace={startPlace}
				onChange={onChange}
				height={height}
			/>
		</APIProvider>
	);
};

const LocationMap = ({
	startPlace,
	onChange,
	height
}: {
	startPlace: LatLng;
	onChange: MapProps["onChange"];
	height: number;
}) => {
	const mapId = useId();
	const map = useMap(mapId);
	const places = useMapsLibrary("places");
	const [selectedPlace, setSelectedPlace] = useState<LatLng>(startPlace);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSearch = useCallback(async () => {
		if (!map || !places || !searchQuery) return;

		setLoading(true);
		try {
			const { places: found } = await places.Place.searchByText({
				textQuery: searchQuery,
				fields: ["location", "viewport"],
				maxResultCount: 1,
				language: "de",
				region: "DE"
			});
			const place = found[0];
			const location = place?.location;
			if (!location) return;

			const nextPlace: LatLng = {
				lat: location.lat(),
				lng: location.lng()
			};
			setSelectedPlace(nextPlace);
			if (place.viewport) {
				map.fitBounds(place.viewport);
			} else {
				map.panTo(nextPlace);
			}
			onChange(nextPlace);
		} catch (error) {
			console.error("Place search failed", error);
		} finally {
			setLoading(false);
		}
	}, [map, onChange, places, searchQuery]);

	return (
		<div>
			<div className="flex row a-ce j-sb w-100">
				<input
					type="text"
					placeholder="Nach einem Ort suchen"
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
					onKeyDown={(event) => {
						if (event.key !== "Enter") return;
						event.preventDefault();
						void handleSearch();
					}}
				/>
				<IconButton
					icon="search"
					text="Suchen"
					onClick={() => {
						void handleSearch();
					}}
					disabled={loading || !searchQuery || !map || !places}
					loading={loading}
				/>
			</div>
			<Divider showLine={false} size="small" />
			<GoogleMap
				id={mapId}
				mapId={CLOUD_MAP_ID}
				defaultCenter={startPlace}
				defaultZoom={10}
				style={{ width: "100%", height }}
			>
				<AdvancedMarker position={selectedPlace} />
			</GoogleMap>
		</div>
	);
};

export default Map;
