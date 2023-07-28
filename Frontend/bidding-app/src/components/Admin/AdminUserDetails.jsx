import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import NameForm from "../Forms/NameForm";
import Username from "../Forms/Username";
import Email from "../Forms/Email";
import NumberForm from "../Forms/NumberForm";
import LocationForm from "../Forms/LocationForm";
import Button from "react-bootstrap/Button";
import Loading from "react-loading";

const AdminUserDetails = () => {
	const [loadingData, setLoadingData] = useState(true);
	const { userName } = useParams();
	const navigate = useNavigate();
	const { auth } = useContext(AuthProvider);

	const [inputError, setInputError] = useState({
		firstNameError: false,
		lastNameError: false,
		usernameError: false,
		emailError: false,
		TINError: false,
		phoneNumberError: false,
		locationError: false,
		countryError: false,
	});

	const [id, setId] = useState();
	const [firstName, setFirstName] = useState();
	const [lastName, setLastName] = useState();
	const [username, setUsername] = useState();
	const [newUserName, setNewUsername] = useState();
	const [email, setEmail] = useState();
	const [checked, setChecked] = useState();
	const [TIN, setTIN] = useState();
	const [phoneNumber, setPhoneNumber] = useState();
	const [location, setLocation] = useState();
	const [country, setCountry] = useState();

	const [userExistsErr, setUserExistsErr] = useState({});

	const getUserData = async () => {
		let response = await fetch(`https://localhost:8000/userprofile/${userName}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
		});

		let data = await response.json();

		if (!response.ok) {
			navigate("/admin/users");
			throw new Error(`Error: ${response.status}`);
		} else {
			setId(data.id);
			setFirstName(data.user_id.first_name);
			setLastName(data.user_id.last_name);
			setUsername(data.user_id.username);
			setEmail(data.user_id.email);
			setChecked(data.user_id.is_active);
			setTIN(data.TIN);
			setPhoneNumber(data.phoneNumber);
			setLocation(data.location);
			setCountry(data.country);
			setNewUsername(data.user_id.username);
			setLoadingData(false);
		}
	};

	useEffect(() => {
		getUserData();
	}, []);

	const update = async () => {
		let isValid = Object.values(inputError).every((value) => value === false);

		if (isValid) {
			let json_structure = {
				id: id,
				user_id: {
					first_name: firstName,
					last_name: lastName,
					username: newUserName,
					email: email,
					is_active: checked,
				},
				TIN: TIN,
				phoneNumber: phoneNumber,
				location: location,
				country: country,
			};

			let response = await fetch(`https://localhost:8000/update-userprofile/${username}/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
				body: JSON.stringify(json_structure),
			});

			if (!response.ok) {
				throw new Error("Updating User Failed");
			} else {
				navigate("/admin/users");
			}
		}
	};

	return loadingData ? (
		<Loading type="spinningBubbles" />
	) : (
		<div>
			<div>
				<br />
				<h2>Edit User {username}</h2>
				<br />
				<div className="container">
					<div className="row">
						<div className="col-sm-4 mx-auto">
							{Object.keys(userExistsErr).map((key) => {
								return (
									<div key={username} style={{ color: "red" }}>
										{userExistsErr[key]}
									</div>
								);
							})}

							<NameForm
								Name={firstName}
								setName={setFirstName}
								inputError={inputError}
								setInputError={setInputError}
								InputName="firstNameError"
								label=" First Name"
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
								username={newUserName}
								setUsername={setNewUsername}
								inputError={inputError}
								setInputError={setInputError}
								InputName="usernameError"
							/>
							<br />

							<br />

							<Email
								email={email}
								setEmail={setEmail}
								inputError={inputError}
								setInputError={setInputError}
								InputName="emailError"
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

							<label>
								<input
									className="form-check-input"
									type="checkbox"
									checked={checked}
									onChange={(e) => {
										setChecked(!checked);
									}}
								/>{" "}
								Is Active
							</label>

							<br />
							<br />
							<Button onClick={update}>Update User Data</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminUserDetails;
