import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import AuthProvider from "../../context/AuthProvider";
import { getTimeFormat } from "../../Helper/helper";
import Loading from "../Loading/Loading";

const Compose = () => {
	const [textInput, setTextInput] = useState("");
	const [textInputError, setTextInputError] = useState(false);
	const [dropDownInputError, setDropDownInputError] = useState(false);
	const [receiverUser, setReceiverUser] = useState("");
	const [subject, setSubject] = useState("");
	const [loadingData, setLoadingData] = useState(true);
	const [possibleReceivers, setPossibleReceivers] = useState();
	const { auth } = useContext(AuthProvider);
	const loaded = useRef(false);

	useEffect(() => {
		getReceivers();
	}, []);

	useEffect(() => {
		if (loaded.current) {
			dropDownValidate();
		}
	}, [receiverUser]);

	useEffect(() => {
		if (loaded.current) {
			textValidate();
		} else loaded.current = true;
	}, [textInput]);

	const getReceivers = async () => {
		let response = await fetch(`https://localhost:8000/list-receivers/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(auth.access),
			},
		});

		let data = await response.json(response);
		if (!response.ok) {
			throw new Error("Error Fetching Receivers");
		} else {
			let receivers = [];
			for (let rec in data) {
				let been_found = false;

				for (let find in receivers) {
					if (receivers[find].sender_user === data[rec].sender_user) {
						been_found = true;
					}
				}
				if (!been_found) receivers.push(data[rec]);
			}

			setPossibleReceivers(receivers);
			setLoadingData(false);
		}
	};

	const textValidate = () => {
		if (textInput.length > 1000 || textInput === "") {
			setTextInputError(true);
			return false;
		} else {
			setTextInputError(false);
			return true;
		}
	};

	const dropDownValidate = () => {
		if (receiverUser === "" || receiverUser === "Choose Receiver") {
			setDropDownInputError(true);
			return false;
		} else {
			setDropDownInputError(false);
			return true;
		}
	};

	const handleChange = (e) => {
		setTextInput(e.target.value);
	};

	const submit = async () => {
		let text_valid = textValidate();
		let receiverValidation = dropDownValidate();

		if (text_valid && receiverValidation) {
			let message_json = {
				message: textInput,
				time: getTimeFormat(new Date()),
				subject: subject.length ? subject : "No Subject",
				receiver_id: receiverUser,
				sender_id: auth.profile_id,
			};

			let response = await fetch(`https://localhost:8000/list-messages/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
				body: JSON.stringify(message_json),
			});

			if (!response.ok) {
				return new Error("Error Posting New Message");
			} else {
				window.location.reload(false);
			}
		}
	};

	let content = null;
	if (possibleReceivers) {
		content = possibleReceivers.map((receiver, key) => (
			<option key={key} value={receiver.sender_id}>
				{receiver.sender_user}
			</option>
		));
	}

	return loadingData ? (
		<Loading type="blank" />
	) : (
		<Form>
			<Form.Group className="d-flex justify-content-start">
				<Form.Select
					isInvalid={dropDownInputError}
					onChange={(e) => {
						setReceiverUser(e.target.value);
					}}
				>
					<option>Choose Receiver</option>
					{content}
				</Form.Select>
			</Form.Group>
			<br />
			<input
				type="text"
				className="form-control"
				placeholder="Subject"
				onChange={(e) => setSubject(e.target.value)}
			/>
			<small className="form-text text-muted d-flex justify-content-start">
				Subject Is Optional
			</small>
			<br />
			<Form.Group className="mb-3">
				<Form.Label>Message</Form.Label>
				<Form.Control
					size="lg"
					as="textarea"
					rows={16}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<br />
				<div className="d-flex">
					{textInputError ? (
						<div className="badge bg-danger text-wrap fs-6">
							{textInput.length}/1000
						</div>
					) : (
						<div className="badge bg-primary text-wrap d-flex justify-content-start fs-6">
							{textInput.length}/1000
						</div>
					)}
				</div>
				<div className="d-flex justify-content-end">
					<Button onClick={submit} variant="primary">
						Send
					</Button>
				</div>
			</Form.Group>
		</Form>
	);
};

export default Compose;
