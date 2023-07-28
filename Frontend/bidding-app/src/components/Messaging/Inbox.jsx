import React, { useContext, useState, useEffect } from "react";
import AuthProvider from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import ReceiverCard from "./ReceiverCard";

const Inbox = () => {
	const { auth } = useContext(AuthProvider);
	const [messages, setMessages] = useState();
	const [noMessages, setNoMessages] = useState("");
	const [loadingMessages, setLoadingMessages] = useState(true);

	const getInboxMessages = async () => {
		let response = await fetch(
			`https://localhost:8000/receiver-messages-card/`,
			{
				method: "GET",
				headers: {
					Authorization: "Bearer " + String(auth.access),
				},
			}
		);

		if (response) {
			let data = await response.json();

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			} else {
				if (data.length) {
					setNoMessages("");
					setMessages(data);
				} else {
					setMessages("");
					setNoMessages("You don't have any messages");
				}

				setLoadingMessages(false);
			}
		}
	};

	const deleteReceiverMessage = async (message) => {
		let response = await fetch(
			`https://localhost:8000/delete-message/${message.id}/`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(auth.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Auction Delete Failed");
		} else {
			setLoadingMessages(true);
			getInboxMessages();
		}
	};

	useEffect(() => {
		getInboxMessages();

		let oneMinute = 1000 * 60 * 1;

		let interval = setInterval(() => {
			getInboxMessages();
		}, oneMinute);

		return () => clearInterval(interval);
	}, []);

	let content = null;

	if (messages) {
		content = messages.map((message) => (
			<div key={message.id.toString()}>
				<ReceiverCard message={message} deleteMessage={deleteReceiverMessage} />
			</div>
		));
	} else {
		content = loadingMessages ? <Loading type="spinningBubbles" /> : null;
	}

	return (
		<div>
			<div className="scrollable-content">{content}</div>
			<h4>{noMessages}</h4>
		</div>
	);
};

export default Inbox;
