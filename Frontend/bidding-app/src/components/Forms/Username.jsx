import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { validUsernameFormat } from "../../helper/helpers";

const Username = (props) => {
	const [usernameErr, setUsernameErr] = useState({});
	const formNotLoaded = useRef(true);

	useEffect(() => {
		if (formNotLoaded.current) {
			formNotLoaded.current = false;
		} else {
			if (props.InputName) formValidation();
		}
	}, [props.username]);

	const formValidation = () => {
		let usernameErr = {};

		if (props.username.length < 3) {
			usernameErr.invalidLength = "Username must be at least 3 characters long";
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		} else if (props.username.length > 20) {
			usernameErr.invalidLength = "Username's 20 Characters Limit Breached";
			props.setInputError((prevState) => ({
				...prevState,
				[props.InputName]: true,
			}));
		} else if (!validUsernameFormat(props.username)) {
			usernameErr.invalidStructure =
				"Username Cannot Contain Spaces Or Any Special Characters Other Than '_'";
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

		setUsernameErr(usernameErr);
	};

	const handleChange = (e) => {
		props.setUsername(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="text"
				name="username"
				onChange={(e) => {
					handleChange(e);
				}}
				value={props.username}
				placeholder="username"
			/>

			{Object.keys(usernameErr).map((key) => {
				return (
					<div key={props.username} style={{ color: "red" }}>
						<h6>{usernameErr[key]}</h6>
					</div>
				);
			})}
		</div>
	);
};

export default Username;
