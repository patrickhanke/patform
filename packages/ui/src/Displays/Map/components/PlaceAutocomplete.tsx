import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
	const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const places = useMapsLibrary('places');

	useEffect(() => {
		if (!places || !inputRef.current) return;

		setPlaceAutocomplete(
			new places.Autocomplete(inputRef.current, 
				{
					fields:['geometry',  'name', 'formatted_address', 'place_id', 'reference']
				}
			));
	}, [places]);

	useEffect(() => {
		if (!placeAutocomplete) return;

		placeAutocomplete.addListener('place_changed', () => {
			onPlaceSelect(placeAutocomplete.getPlace());
		});
	}, [onPlaceSelect, placeAutocomplete]);

	return (
		<div className="autocomplete-container">
			<input ref={inputRef} />
		</div>
	);
};

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  }

export default PlaceAutocomplete;