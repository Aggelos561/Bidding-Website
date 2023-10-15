import React, { useRef, useEffect, useState } from "react";
import { onlyLetters } from "../../helper/helpers";

const LocationForm = (props) => {
	const [locationErr, setLocationErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.location]);

	const formValidation = () => {
		let locationErr = {};

		let inputValid = true;

		if (props.location.length < 3) {
			locationErr.loactionLength = "Must be at least 3 characters";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (props.location.length > 20) {
			locationErr.locationLength = "20 Character Limit Breached";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (!onlyLetters(props.location)) {
			locationErr.locationNumersError = "Cannot Contain Any Numbers Or Special Characters";
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

		setLocationErr(locationErr);
	};

	const handleChange = (e) => {
		props.setLocation(e.target.value);
	};

	return (
		<div>
			<label></label>
			<input
				className="form-control"
				disabled={props.isDisabled}
				type="text"
				name={props.label}
				onChange={(e) => {
					handleChange(e);
				}}
				value={props.location}
				placeholder={props.label}
			/>

			{Object.keys(locationErr).map((key) => {
				return (
					<div key={key} style={{ color: "red" }}>
						<h6>{locationErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default LocationForm;
