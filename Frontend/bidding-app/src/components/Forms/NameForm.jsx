import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { validNameFormat } from "../../helper/helpers";

const NameForm = (props) => {
	const [nameErr, setNameErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.Name]);

	const formValidation = () => {
		let nameErr = {};
		let inputValid = true;

		if (props.Name.length < 3) {
			nameErr.invalidLength = "First Name must be at least 3 characters long";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (props.Name.length > 20) {
			nameErr.invalidLength = "First Name's 20 Characters Limit Breached";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		}
		if (!validNameFormat(props.Name)) {
			nameErr.invalidStructure =
				"First Name Cannot Contain Any Numbers Or Special Characters";
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
			<input
				className="form-control"
				type="text"
				name={props.label}
				onChange={(e) => handleChange(e)}
				value={props.Name}
				placeholder={props.label}
			/>

			{Object.keys(nameErr).map((key) => {
				return (
					<div key={key} style={{ color: "red" }}>
						<h6>{nameErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default NameForm;
