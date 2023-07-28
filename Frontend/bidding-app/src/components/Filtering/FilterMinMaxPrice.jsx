import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";

const FilterMinMaxPrice = (props) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const minPriceLoaded = useRef(false);
	const maxPriceLoaded = useRef(false);

	const minPriceFilterFormat = () => {
		let minPriceFilter = searchParams.get(props.minPrice);

		if (minPriceFilter === "" || minPriceFilter === null) {
			return "";
		} else {
			return minPriceFilter;
		}
	};

	const maxPriceFilterFormat = () => {
		let maxPriceFilter = searchParams.get(props.maxPrice);

		if (maxPriceFilter === "" || maxPriceFilter === null) {
			return "";
		} else {
			return maxPriceFilter;
		}
	};

	const [minPrice, setMinPrice] = useState(minPriceFilterFormat);
	const [maxPrice, setMaxPrice] = useState(maxPriceFilterFormat);

	const searchPrice = (event) => {
		event.preventDefault();
		updateParams();
	};

	const updateParams = () => {
		let updatedSearchParams = new URLSearchParams(searchParams.toString());
		updatedSearchParams.set("page", "1");
		updatedSearchParams.set(props.minPrice, `${minPrice}`);
		updatedSearchParams.set(props.maxPrice, `${maxPrice}`);
		setSearchParams(updatedSearchParams.toString());
	};

	useEffect(() => {
		if (minPriceLoaded.current && minPrice === "") {
			updateParams();
		} else {
			minPriceLoaded.current = true;
		}
	}, [minPrice]);

	useEffect(() => {
		if (maxPriceLoaded.current && maxPrice === "") {
			updateParams();
		} else {
			maxPriceLoaded.current = true;
		}
	}, [maxPrice]);

	return (
		<div>
			<form onSubmit={searchPrice}>
				<label>
					<h6>{props.label}</h6>
				</label>
				<div className="input-group">
					<input
						className="form-control"
						type="number"
						onChange={(e) => setMinPrice(e.target.value)}
						value={minPrice}
						placeholder="Min Price"
					/>
					<input
						className="form-control"
						type="number"
						onChange={(e) => setMaxPrice(e.target.value)}
						value={maxPrice}
						placeholder="Max Price"
					/>
					<Button type="submit">&gt;</Button>
				</div>
			</form>
		</div>
	);
};

export default FilterMinMaxPrice;
