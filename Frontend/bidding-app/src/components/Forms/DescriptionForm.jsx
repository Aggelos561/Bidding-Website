import React, { useRef, useEffect, useState } from "react";

const DescriptionForm = (props) => {
	const [descriptionErr, setDescriptionErr] = useState({});

	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.description]);

	const setInputError = (value) => {
		props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: value,
		}));
	};

	const formValidation = () => {
		let descriptionErr = {};

		let inputValid = true;

		if (props.description.length === 0) {
			descriptionErr.emptyDescription = "Description cannot be empty";
			inputValid = false;
			setInputError(true);
		} else if (props.description.length > 2000) {
			descriptionErr.oversized = "Limit of 2000 characters breached";
			inputValid = false;
			setInputError(true);
		}

		if (inputValid) {
			setInputError(false);
		}

		setDescriptionErr(descriptionErr);
	};

	const handleChange = (e) => {
		props.setDescription(e.target.value);
	};

	return (
		<div>
			<br />
			<textarea
				className="form-control"
				type="text"
				name="description"
				disabled={props.isDisabled}
				onChange={(e) => handleChange(e)}
				value={props.description}
				rows="10"
				cols="50"
				placeholder="Write A Description For Your Products/Auction"
				required
			/>
			{Object.keys(descriptionErr).map((key) => {
				return (
					<div key={props.description} style={{ color: "red" }}>
						<h5>{descriptionErr[key]}</h5>
					</div>
				);
			})}
		</div>
	);
};

export default DescriptionForm;
