import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useSearchParams } from "react-router-dom";

const FilteredCategories = (props) => {
	const [categoryName, setCategoryName] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();

	const categoryFiltersFormat = () => {
		let catFilters = searchParams.get("category__name");

		if (catFilters === "" || catFilters === null) {
			return [];
		} else {
			return catFilters?.split(",");
		}
	};

	const [selectCategory, setSelectCategeory] = useState(categoryFiltersFormat());

	useEffect(() => {
		let categoriesList = [];

		fetch("https://localhost:8000/category/", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => data.json())
			.then((data) => {
				for (var category in data) {
					categoriesList.push(data[category].name);
				}
			})
			.then(() => setCategoryName(categoriesList));
	}, []);

	const handleChange = (e) => {
		setSelectCategeory(e);

		let queryParams = "";
		for (let cat in e) {
			queryParams += e[cat] + ",";
		}
		queryParams = queryParams.slice(0, -1);
		let updatedSearchParams = new URLSearchParams(searchParams.toString());
		updatedSearchParams.set("category__name", queryParams);
		updatedSearchParams.set("page", 1);
		setSearchParams(updatedSearchParams.toString());
	};

	return (
		<div>
			<label>
				<h6>Categories:</h6>
			</label>
			<div className="dropdown-container">
				<Multiselect
					showArrow
					selectionLimit={5}
					options={categoryName}
					isObject={false}
					onSelect={(e) => {
						handleChange(e);
					}}
					onRemove={(e) => {
						handleChange(e);
					}}
					selectedValues={selectCategory}
					placeholder={props.placeholder}
				/>
			</div>
		</div>
	);
};

export default FilteredCategories;
