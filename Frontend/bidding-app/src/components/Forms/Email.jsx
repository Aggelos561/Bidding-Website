import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { validEmail } from "../../Helper/helper";

const Email = (props) => {
	const [emailErr, setEmailErr] = useState({});

	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.email]);

	const formValidation = () => {
		let emailErr = {};
	  
		if (!validEmail(props.email)) {
		  emailErr.notValid = "Email is not Valid";
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
	  
		if (props.email.length > 50) {
		  emailErr.tooLong = "Email should be no more than 50 characters";
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
	  
		setEmailErr(emailErr);
	  };	  

	const handleChange = (e) => {
		props.setEmail(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="email"
				name="email"
				onChange={(e) => handleChange(e)}
				value={props.email}
				placeholder="example@mail.com"
			/>
			
			{Object.keys(emailErr).map((key) => {
				return (
					<div key={props.email} style={{ color: "red" }}>
						<h6>{emailErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default Email;
