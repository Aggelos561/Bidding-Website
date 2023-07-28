import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

const FilterAuctionsName = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const loaded = useRef(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		setSearch(searchFilterFormat());
	}, []);

	useEffect(() => {
		if (loaded.current && search === "") {
			updateParams();
		} else {
			loaded.current = true;
		}
	}, [search]);

	const searchFilterFormat = () => {
		let searchFilter = searchParams.get("name");

		if (searchFilter === "" || searchFilter === null) {
			return "";
		} else {
			return searchFilter;
		}
	};

	const updateParams = () => {
		let updatedSearchParams = new URLSearchParams(searchParams.toString());
		updatedSearchParams.set("page", "1");
		updatedSearchParams.set("name", `${search}`);
		setSearchParams(updatedSearchParams.toString());
	};

	const searchFunc = (event) => {
		event.preventDefault();
		updateParams();
	};

	return (
		<div>
			<form onSubmit={searchFunc}>
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						onChange={(e) => setSearch(e.target.value)}
						value={search}
						placeholder="Search..."
					/>

					<div className="input-group-addon" style={{ paddingLeft: 7 }}>
						<Button type="submit">Search</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default FilterAuctionsName;
