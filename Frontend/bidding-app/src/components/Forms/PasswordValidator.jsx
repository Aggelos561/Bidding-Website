import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const PasswordValidator = (props) => {
	const [passwordErr, setPasswordErr] = useState({});
	const [password2Err, setPassword2Err] = useState({});

	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) formNotLoaded.current = false;
		else formValidation();
	}, [props.password, props.password2]);

	const formValidation = () => {
		let passwordErr = {};
		let password2Err = {};

		let inputValid = true;

		if (props.password !== props.password2) {
			password2Err.mismatchedPassword = "Password Mismatch";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName2]: true,
			}));
		}

		if (props.password.length < 8) {
			passwordErr.passwordSize = "Password must be at least 8 characters";
			inputValid = false;
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName1]: true,
			}));
		}
		if (inputValid) {
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName2]: false,
				[props.InputName1]: false,
			}));
		}

		setPasswordErr(passwordErr);
		setPassword2Err(password2Err);
	};

	const handlePasswordChange = (e) => {
		props.setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		props.setPassword2(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="password"
				name="password"
				onChange={(e) => handlePasswordChange(e)}
				value={props.password}
				placeholder="Password"
			/>

			{Object.keys(passwordErr).map((key) => {
				return (
					<div key={props.password} style={{ color: "red" }}>
						<h6>{passwordErr[key]}</h6>
					</div>
				);
			})}

			<br />

			<input
				className="form-control"
				type="password"
				name="password2"
				onChange={(e) => handleConfirmPasswordChange(e)}
				value={props.password2}
				placeholder="Confirm Password"
			/>

			{Object.keys(password2Err).map((key) => {
				return (
					<div key={props.password2} style={{ color: "red" }}>
						<h6>{password2Err[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default PasswordValidator;
