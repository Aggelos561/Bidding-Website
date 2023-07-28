import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Email from "../Forms/Email";
import LocationForm from "../Forms/LocationForm";
import NameForm from "../Forms/NameForm";
import NumberForm from "../Forms/NumberForm";
import PasswordValidator from "../Forms/PasswordValidator";
import Username from "../Forms/Username";
import Button from "react-bootstrap/Button";

const Register = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [TIN, setTIN] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [location, setLocation] = useState("");
	const [country, setCountry] = useState("");

	const [inputError, setInputError] = useState({
		firstNameError: true,
		lastNameError: true,
		usernameError: true,
		emailError: true,
		passwordError: true,
		password2Error: true,
		TINError: true,
		phoneNumberError: true,
		locationError: true,
		countryError: true,
	});

	const [userExistsErr, setUserExistsErr] = useState({});
	const navigate = useNavigate();

	const submit = (e) => {
		const formValid = Object.values(inputError).every((value) => value === false);
		let userExistsError = {};

		if (formValid) {
			let json_structure = {
				user_id: {
					first_name: firstName,
					last_name: lastName,
					username: username,
					email: email,
					password: password,
					password2: password2,
				},
				TIN: TIN,
				phoneNumber: phoneNumber,
				location: location,
				country: country,
			};

			fetch("https://localhost:8000/register/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(json_structure),
			}).then((data) => {
				console.log(data.status);
				if (!data.ok) {
					userExistsError.userAlreadyExists =
						"A user with that username or email already exists";
					setUserExistsErr(userExistsError);

					return;
				}
				navigate("/inactive-user", {
					state: {
						access: true,
					},
				});
				return data.json();
			});
		}
	};

	return (
		<div>
			<h2>Register</h2>
			<div className="container">
				<div className="row">
					<div className="col-sm-4 mx-auto">
						{Object.keys(userExistsErr).map((key) => {
							return (
								<div key={username} style={{ color: "red" }}>
									<h5>{userExistsErr[key]}</h5>
								</div>
							);
						})}

						<NameForm
							Name={firstName}
							setName={setFirstName}
							inputError={inputError}
							setInputError={setInputError}
							InputName="firstNameError"
							label="First Name"
						/>

						<br />

						<NameForm
							Name={lastName}
							setName={setLastName}
							inputError={inputError}
							setInputError={setInputError}
							InputName="lastNameError"
							label="Last Name"
						/>

						<br />

						<Username
							username={username}
							setUsername={setUsername}
							inputError={inputError}
							setInputError={setInputError}
							InputName="usernameError"
						/>

						<br />

						<Email
							email={email}
							setEmail={setEmail}
							inputError={inputError}
							setInputError={setInputError}
							InputName="emailError"
						/>

						<br />

						<PasswordValidator
							password={password}
							setPassword={setPassword}
							password2={password2}
							setPassword2={setPassword2}
							inputError={inputError}
							setInputError={setInputError}
							InputName1="passwordError"
							InputName2="password2Error"
						/>

						<br />

						<NumberForm
							number={TIN}
							setNumber={setTIN}
							inputError={inputError}
							setInputError={setInputError}
							InputName="TINError"
							label="TIN"
						/>

						<br />

						<NumberForm
							number={phoneNumber}
							setNumber={setPhoneNumber}
							inputError={inputError}
							setInputError={setInputError}
							InputName="phoneNumberError"
							label="Phone Number"
						/>

						<br />

						<LocationForm
							location={location}
							setLocation={setLocation}
							inputError={inputError}
							setInputError={setInputError}
							InputName="locationError"
							label="Location"
						/>

						<br />

						<LocationForm
							location={country}
							setLocation={setCountry}
							inputError={inputError}
							setInputError={setInputError}
							InputName="countryError"
							label="Country"
						/>

						<br />
						<Button onClick={submit}>Register</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
