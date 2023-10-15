import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AuthProvider from "../../context/AuthProvider";
import { formatDate } from "../../helper/helpers";
import Form from "react-bootstrap/Form";
import Loading from "../Loading/Loading";

const MessageDetails = () => {
	let { id } = useParams();
	const { auth } = useContext(AuthProvider);
	const { state } = useLocation();
	const [message, setMessage] = useState("");
	const [loadingMessage, setLoadingMessage] = useState(true);

	const getMessageData = async () => {
		let response = await fetch(
			`https://localhost:8000/${state.user}-message-details/${id}/`,
			{
				method: "GET",
				headers: {
					Authorization: "Bearer " + String(auth.access),
				},
			}
		);

		let data = await response.json();

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		} else {
			setMessage(data);
			setLoadingMessage(false);
		}
	};

	useEffect(() => {
		getMessageData();
	}, []);

	return loadingMessage ? (
		<Loading type="spinningBubbles" />
	) : (
		<div>
			<br />
			<br />
			<div className="container">
				<h5 className="d-flex justify-content-start ">{`From: ${message.sender_user}`}</h5>
				<h5 className="d-flex justify-content-start ">
					{`Time Sent: ${formatDate(message.time)}`}
				</h5>

				<Form.Group className="mb-3">
					<Form.Label>
						<h5>Subject</h5>
					</Form.Label>
					<Form.Control
						size="lg"
						as="textarea"
						rows={1}
						value={message.subject}
						readOnly
					/>
					<br />
					<Form.Label>
						<h5>Message</h5>
					</Form.Label>
					<Form.Control
						size="lg"
						as="textarea"
						rows={15}
						value={message.message}
						readOnly
					/>
				</Form.Group>
			</div>
			<br />
			<br />
		</div>
	);
};

export default MessageDetails;
