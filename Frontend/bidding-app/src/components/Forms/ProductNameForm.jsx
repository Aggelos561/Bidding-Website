import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { lettersNumbers } from "../../Helper/helper";

const ProductNameForm = (props) => {
	const [nameErr, setNameErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.name]);

	const formValidation = () => {
		let nameErr = {};

		let inputValid = true;

		if (props.name.length < 3) {
			nameErr.shortName = "Products name must be at least 3 characters";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (props.name.length > 20) {
			nameErr.longName = "Limit of 20 Characters";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (!lettersNumbers(props.name)) {
			nameErr.productNameError = "Product Name can contain only letters, numbers and spaces";
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

		setNameErr(nameErr);
	};

	const handleChange = (e) => {
		props.setName(e.target.value);
	};

	return (
		<div>
			{Object.keys(nameErr).map((key) => {
				return (
					<div key={props.name} style={{ color: "red" }}>
						<h6>{nameErr[key]}</h6>
					</div>
				);
			})}

			<input
				className="form-control"
				type="text"
				name="name"
				disabled={props.isDisabled}
				onChange={(e) => handleChange(e)}
				value={props.name}
				placeholder="Product(s) Name"
			/>
		</div>
	);
};

export default ProductNameForm;
