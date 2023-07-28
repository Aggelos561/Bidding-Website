import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import AuthContext from "../../context/AuthProvider";
import AuthProvider from "../../context/AuthProvider";
import Username from "../Forms/Username";
import Password from "../Forms/Password";
import Button from "react-bootstrap/Button";

const Login = () => {
	const { setAuth } = useContext(AuthContext);
	const { setLoading } = useContext(AuthProvider);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [formErr, setFormErr] = useState({});

	const navigate = useNavigate();

	const submit = (e) => {
		e.preventDefault();
		formValidation();
	};

	const formValidation = async () => {
		const formErr = {};

		let response = await fetch("https://localhost:8000/login/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		let jwt_token = await response.json();

		if (!response.ok) {
			let response = await fetch(`https://localhost:8000/userprofile/${username}/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			let data = await response.json();

			if (!response.ok) {
				formErr.formErrValidation = "No such user found.";
				setFormErr(formErr);
				throw new Error("No such user found.");
			} else {
				if (data.user_id.is_active) {
					formErr.formErrValidation = "Invalid Password";
					setFormErr(formErr);
					throw new Error("Invalid Password");
				} else {
					navigate("/inactive-user", {
						state: {
							access: true,
						},
					});

					throw new Error("User is inactive");
				}
			}
		} else {
			let dec_token = jwt_decode(jwt_token.access);
			let access = jwt_token.access;
			let refresh = jwt_token.refresh;
			let tok_username = dec_token.username;
			let profile_id = dec_token.profile_id;
			let is_superuser = dec_token.is_superuser;

			setAuth({ access, refresh, tok_username, profile_id, is_superuser });
			localStorage.setItem(
				"USER_INFORMATION",
				JSON.stringify({ access, refresh, tok_username, profile_id, is_superuser })
			);

			setLoading(true);

			if (is_superuser) {
				navigate("/admin");
			} else {
				navigate("/");
			}
		}
	};

	return (
		<div>
			<h1 className="h1">Login</h1>
			<br />
			{Object.keys(formErr).map((key) => {
				return (
					<div key={username} style={{ color: "red" }}>
						<h5>{formErr[key]}</h5>
					</div>
				);
			})}
			<div className="container">
				<div className="row">
					<div className="col-sm-4 mx-auto">
						<form onSubmit={submit}>
							<Username username={username} setUsername={setUsername} />
							<br />
							<Password password={password} setPassword={setPassword} />
							<br />
							<Button type="submit">login</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
