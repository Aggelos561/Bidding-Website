import React, { useRef, useEffect, useState } from "react";
import { isNumeric } from "../../helper/helpers";

const NumberForm = (props) => {
	const [numberErr, setNumberErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.number]);

	const formValidation = () => {
		let numberErr = {};
	  
		if (!isNumeric(props.number.toString())) {
		  numberErr.invalidFormat = "Invalid format. Please enter a valid number.";
		  props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: true,
		  }));
		} else if (props.number.toString().length !== 10) {
		  numberErr.invalidLength = "Must be 10 characters long.";
		  props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: true,
		  }));
		} else {
		  props.setInputError((prevState) => ({
			...prevState,
			[props.InputName]: false,
		  }));
		}
	  
		setNumberErr(numberErr);
	  };
	  
	  

	const handleChange = (e) => {
		props.setNumber(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="number"
				name={props.label}
				onChange={(e) => handleChange(e)}
				value={props.number}
				placeholder={props.label}
			/>

			{Object.keys(numberErr).map((key) => {
				return (
					<div key={props.number} style={{ color: "red" }}>
						<h6>{numberErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default NumberForm;
