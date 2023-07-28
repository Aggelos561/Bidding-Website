import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

const FilteredLocation = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const loaded = useRef(false);

	const locationFilterFormat = () => {
		let locationFilter = searchParams.get("location");

		if (locationFilter === "" || locationFilter === null) {
			return "";
		} else {
			return locationFilter;
		}
	};

	const [location, setLocation] = useState(locationFilterFormat());

	const updateParams = () => {
		let updatedSearchParams = new URLSearchParams(searchParams.toString());
		updatedSearchParams.set("page", "1");
		updatedSearchParams.set("location", `${location}`);
		setSearchParams(updatedSearchParams.toString());
	};

	const searchLocation = (event) => {
		event.preventDefault();
		updateParams();
	};

	useEffect(() => {
		if (loaded.current && location === "") {
			updateParams();
		} else {
			loaded.current = true;
		}
	}, [location]);

	return (
		<div>
			<form onSubmit={searchLocation}>
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						onChange={(e) => setLocation(e.target.value)}
						value={location}
						placeholder="Search By Location..."
					/>
					<div className="input-group-addon" style={{ paddingLeft: 7 }}>
						<Button type="submit">Search</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default FilteredLocation;
