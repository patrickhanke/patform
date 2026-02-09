import { useState } from "react";
import {
	IconButton,
	Map,
	Modal,
	LatLng,
	TableColumnGeopointProps
} from "@repo/ui";

const TableColumnGeopoint = ({
	value,
	isEditable = false,
	onChange
}: TableColumnGeopointProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [geopoint, setGeopoint] = useState<LatLng | null>({
		lat: value?.lat,
		lng: value?.lng
	});

	return (
		<>
			<div className="table_column_textfield_container">
				<span>
					{value ? value.lat : "-"}
					<br />
					{value ? value.lng : "-"}
				</span>

				{isEditable && (
					<>
						{!isOpen ? (
							<IconButton
								icon="edit"
								onClick={() => setIsOpen(!isOpen)}
							/>
						) : (
							<IconButton
								icon="check"
								onClick={() => {
									setIsOpen(!isOpen);
								}}
							/>
						)}
					</>
				)}
			</div>
			<Modal
				isOpen={isOpen}
				cancelButtonHandler={() => setIsOpen(false)}
				confirmButtonHandler={() => {
					if (geopoint) {
						onChange(geopoint);
					}
					setIsOpen(false);
				}}
				header={"KartenDaten ändern"}
				buttonDisabled={[false, !geopoint]}
			>
				<div className={"table_column_textfield_textarea_container"}>
					<Map
						initialPlace={{
							lat: geopoint?.lat || 0,
							lng: geopoint?.lng || 0
						}}
						onChange={(geopointer) => setGeopoint(geopointer)}
						height={300}
					/>
				</div>
			</Modal>
		</>
	);
};

export default TableColumnGeopoint;
