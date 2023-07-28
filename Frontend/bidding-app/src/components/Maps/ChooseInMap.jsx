import React, { memo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import Button from "react-bootstrap/Button";

const ChooseInMap = (props) => {
	function HandleClickMap() {
		const map = useMapEvents({
			click(e) {
				props.setCoordinates(e.latlng);
				props.setLongtitude(JSON.stringify(e.latlng.lng));
				props.setLatitude(JSON.stringify(e.latlng.lat));
				map.flyTo(e.latlng, 12);
			},
		});

		return props.coordinates === null ? null : (
			<Marker
				position={props.coordinates}
				icon={
					new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })
				}
			>
				<Popup>
					This Is Your Location
					<br />
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							removeMarker();
						}}
					>
						Remove Marker
					</Button>
				</Popup>
			</Marker>
		);
	}

	const removeMarker = () => {
		props.setCoordinates(null);
		props.setLongtitude(null);
		props.setLatitude(null);
	};

	return (
		<div>
			<MapContainer
				style={{ width: "40vw", height: "40vh", margin: "auto" }}
				center={{ lat: 39.0742, lng: 21.8243 }}
				zoom={6}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<HandleClickMap />
			</MapContainer>
		</div>
	);
};

export default memo(ChooseInMap);
