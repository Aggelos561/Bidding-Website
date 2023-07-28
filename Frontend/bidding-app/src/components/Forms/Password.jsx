import React from "react";

const Password = (props) => {
	const handleChange = (e) => {
		props.setPassword(e.target.value);
	};

	return (
		<div>
			<input
				className="form-control"
				type="password"
				name="password"
				onChange={(e) => {
					handleChange(e);
				}}
				value={props.password}
				placeholder="password"
			/>
		</div>
	);
};

export default Password;
