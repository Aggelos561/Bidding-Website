import React, { useRef, useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";

const CategoriesSelect = (props) => {
	const [chosenCategoryErr, setChosenCategoryErr] = useState({});
	const [categoryName, setCategoryName] = useState([]);
	const formNotLoaded = useRef(true);

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

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.chosenCategory]);

	const formValidation = () => {
		let chosenCategoryErr = {};

		let inputValid = true;

		if (props.chosenCategory.length < 1) {
			chosenCategoryErr.chosenCategory = "Select at least one category";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}

		if (inputValid) {
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: false,
			}));
		}

		setChosenCategoryErr(chosenCategoryErr);
	};

	const handleChange = (e) => {
		props.setChosenCategory(e);
	};

	return (
		<div>
			<label>
				<h5>Categories:</h5>{" "}
			</label>
			{Object.keys(chosenCategoryErr).map((key) => {
				return (
					<div key={props.chosenCategory} style={{ color: "red" }}>
						<h6>{chosenCategoryErr[key]}</h6>
					</div>
				);
			})}

			<div className="dropdown-container">
				<Multiselect
					disable={props.isDisabled}
					selectionLimit={5}
					options={categoryName}
					isObject={false}
					onSelect={(e) => {
						handleChange(e);
					}}
					onRemove={(e) => {
						handleChange(e);
					}}
					selectedValues={props.chosenCategory}
					placeholder="Choose Categories"
				/>
			</div>
		</div>
	);
};

export default CategoriesSelect;
