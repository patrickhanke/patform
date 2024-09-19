'use client';

import { useState } from 'react';
import {
	APIProvider,
	ControlPosition,
	MapControl,
	AdvancedMarker,
	Map as MapComponent,
	useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import './styles.scss';
import PlaceAutocomplete from './components/PlaceAutocomplete';
import { MapProps } from './types';
import MapHandler from './components/MapHandler';

const API_KEY ='AIzaSyAJgX9vOxmGb-w5JtU4z9xrlXJ0vKpQHP8';

const Map = ({initialPlace, onChange, height}: MapProps) => {
	const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(initialPlace || null);
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<APIProvider
			apiKey={API_KEY}
			solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
		>
			<MapComponent
				mapId={'bf51a910020fa25a'}
				defaultZoom={initialPlace ? 15 : 3}
				defaultCenter={ initialPlace || { lat: 0, lng: 0 }}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
				style={{ height: height || 300, width: '100%' }}
			>
				<AdvancedMarker ref={markerRef} position={null} />
			</MapComponent>
			<MapControl position={ControlPosition.LEFT_TOP}>
				<div className="autocomplete-control">
					<PlaceAutocomplete onPlaceSelect={(place) => {
						setSelectedPlace(place);
						onChange(place);
					}}
					/>
				</div>
			</MapControl>
			<MapHandler place={selectedPlace} marker={marker} />
		</APIProvider>
	);
};







export default Map;